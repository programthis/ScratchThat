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
			let songs = playlist.songs;
			return songs;
		}
		else {
			return false;
		}
	},
	song: function(songId) {
		let song = Songs.findOne(songId);
		if (song) {
			return song;
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
	}
})