import { Template } from 'meteor/templating';
import { Songs } from '../../api/songs.js';
import { Playlists } from '../../api/playlists.js';

import "./playlist.html";

Template.playlist.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe("songs");
		self.subscribe("playlists");
	});
});

Template.playlist.helpers({
	songs: function() {
		let playlist = Playlists.findOne({});
		if (playlist) {
			let songIds = playlist.songs;
				songs = Songs.find({"_id": {"$in": songIds}});
			return songs;
		}
		else {
			return false;
		}
	}
});

Template.playlist.events({
	"click .syncSoundCloud": function(evt) {
		evt.preventDefault();
		Meteor.call("syncSoundCloud");
	},
	"click .delete": function(evt) {
		evt.preventDefault();
		let songId = this._id;
		Meteor.call("deleteSong", songId);
	}
})