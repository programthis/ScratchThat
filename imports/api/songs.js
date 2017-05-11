import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Songs = new Mongo.Collection("songs");

Songs.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Song Name"
	},
	url: {
		type: String,
		label: "Song Url",
		unique: true
	},
	userId: {
		type: String,
		label: "User ID"
	}
}));

if (Meteor.isServer) {
	Meteor.publish("songs", function() {
		return Songs.find({});
	});
}

Meteor.methods({
	addSong: function(name, url) {
		Songs.insert({
			name: name,
			url: url,
			userId: Meteor.userId()
		});
	},
	syncSoundCloud: function() {
		let client_id = Meteor.settings.private.sc_client_id,
			client_secret = Meteor.settings.private.sc_client_secret,
			username = Meteor.settings.private.sc_username,
			password = Meteor.settings.private.sc_password;

		Soundcloud.setConfig({
			client_id : client_id,
			client_secret : client_secret,
			username : username,
			password: password
		});

		let client = Soundcloud.getClient(),
			me = client.getSync('/me', {limit : 1}),
			playlist = client.getSync('/me/playlists', {limit : 1});

		playlist[0].tracks.forEach(function(track) {
			console.log(track);
			Meteor.call("addSong", track.title, track.stream_url, function(error, result){});
		});
	}
});