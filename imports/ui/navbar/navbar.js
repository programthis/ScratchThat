import { Template } from 'meteor/templating';
import { Songs } from '../../api/songs.js';
import { Playlists } from '../../api/playlists.js';

import "./navbar.html";

Template.navbar.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe("songs");
		self.subscribe("playlists");
	});
});

Template.navbar.helpers({
	song: function() {
		let playlist = Playlists.findOne({});
		if (playlist) {
			let songId = playlist.nowPlaying,
				song = Songs.findOne(songId);
			return song;
		}
		else {
			return false;
		}
	}
});

Template.navbar.events({
	"click .navbarMobileToggle": function(evt) {
		evt.preventDefault();
		$(".navbarMobileLinks").slideToggle("fast");
	},
	"click .navbarMobileLinks li": function() {
		$(".navbarMobileLinks").slideToggle("fast");
	}
});