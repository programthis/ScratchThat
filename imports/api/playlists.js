import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Playlists = new Mongo.Collection("playlists");

SongSchema = new SimpleSchema({
	_id: {
		type: String,
		label: "Song ID"
	},
	alreadyPlayed: {
		type: Boolean,
		label: "Already Played Flag",
		defaultValue: false
	}
});

Playlists.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Playlist Name"
	},
	songs: {
		type: [SongSchema],
		label: "Songs"
	},
	userId: {
		type: String,
		label: "User ID"
	}
}));

if (Meteor.isServer) {
	Meteor.publish("playlists", function() {
		return Playlists.find({});
	});
}

Meteor.methods({
	addPlaylist: function(name) {
		Playlists.insert({
			name: name,
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