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

Template.navbar.events({
	"click .navbarMobileToggle": function(evt) {
		evt.preventDefault();
		$(".navbarMobileLinks").slideToggle("fast");
	},
	"click .navbarMobileLinks li": function() {
		$(".navbarMobileLinks").slideToggle("fast");
	},
	"click .play": function(evt) {
		evt.preventDefault();
		let playlist = Playlists.findOne({}),
			songs = playlist.songs,
			songId = songs.find(function(song) {
				return song.alreadyPlayed === false;
			})._id,
			song = Songs.findOne(songId);

		soundManager.setup({
			url: 'swf/',
			onready: function() {
				var mySound = soundManager.createSound({
					id: "track" + song._id,
					url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id
				});
				mySound.play();
			},
		 	ontimeout: function() {
		 	  // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
		 	}
		});
	}
});