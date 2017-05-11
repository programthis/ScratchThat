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
		label: "Songs",
		defaultValue: []
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
				songs: {
					_id: songId,
					alreadyPlayed: false
				}
			}
		});
	}
});