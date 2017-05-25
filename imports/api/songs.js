import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Playlists } from './playlists.js';

export const Songs = new Mongo.Collection("songs");

Songs.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Song Name"
	},
	url: {
		type: String,
		label: "Song Url"
	},
	userId: {
		type: String,
		label: "User ID"
	},
	sourceUrl: {
		type: String,
		label: "Source URL"
	}
}));

if (Meteor.isServer) {
	Meteor.publish("songs", function() {
		return Songs.find({});
	});
}

Meteor.methods({
	addSong: function(name, url, sourceUrl) {
		return Songs.insert({
			name: name,
			url: url,
			userId: Meteor.userId(),
			sourceUrl: sourceUrl
		});
	},
	deleteSong: function(songId) {
		console.log("Deleting song from playlist...");
		// Songs.remove(songId);
		let playlist = Playlists.findOne({});
		Playlists.update({_id: playlist._id}, {
			$pull: {
				songs: songId
			}
		});
	},
	searchSong: function(text) {
		console.log("Searching for song(s)...");
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
			tracks = client.getSync('/tracks', {limit: 7, q: text});
		return tracks;
	}
});