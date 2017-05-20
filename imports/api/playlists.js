import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Playlists = new Mongo.Collection("playlists");

Playlists.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Playlist Name"
	},
	songs: {
		type: [String],
		label: "Song IDs",
		defaultValue: []
	},
	userId: {
		type: String,
		label: "User ID"
	},
	nowPlaying: {
		type: String,
		label: "Now Playing Song ID",
		defaultValue: ""
	}
}));

if (Meteor.isServer) {
	Meteor.publish("playlists", function() {
		return Playlists.find({});
	});
}

Meteor.methods({
	addPlaylist: function(name) {
		console.log("Adding playlist...");
		Playlists.insert({
			name: name,
			userId: Meteor.userId()
		});
	},
	addSongToPlaylist: function(songId) {
		console.log("Adding song to playlist...");
		let playlist = Playlists.findOne({});
		Playlists.update({_id: playlist._id}, {
			$addToSet: {
				songs: songId
			}
		});
	},
	updateNowPlaying: function(songId) {
		console.log("Updating the song that is currently playing in the playlist...");
		let playlist = Playlists.findOne({});
		Playlists.update({_id: playlist._id}, {
			$set: {
				nowPlaying: songId
			}
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

		Meteor.call("addPlaylist", "Main Playlist", function(error, result){});

		let client = Soundcloud.getClient(),
			me = client.getSync('/me', {limit : 1}),
			playlist = client.getSync('/me/playlists', {limit : 1});

		playlist[0].tracks.forEach(function(track) {
			Meteor.call("addSong", track.title, track.stream_url, function(error, result) {
				if (error) {
				}
				else {
					Meteor.call("addSongToPlaylist", result);
				}
			});
		});
	}
});