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
	},
	"click .play": function(evt) {
		evt.preventDefault();
		let isPlaying = Meteor.user().profile.isPlaying,
			playlist = Playlists.findOne({}),
			songs = playlist.songs,
			songId = songs[0],
			song = Songs.findOne(songId);

		if (isPlaying) {
			isPlaying = false;
		}
		else {
			isPlaying = true;
		}
		Meteor.call("updateUserProfile", "isPlaying", isPlaying);
		Meteor.call("updateNowPlaying", songId);

		soundManager.url = 'swf/';
		soundManager.onready(function() {
			let mySound = soundManager.createSound({
				id: song._id,
				url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id,
				onfinish: function() {
					nextTrack(songId);
				}
			});

			if (isPlaying){
				soundManager.play(song._id);
			}
			else {
				soundManager.pause(song._id);
			}
		});

		
		// soundManager.setup({
		// 	url: 'swf/',
		// 	onready: function() {
		// 		let mySound;
		// 		if (isPlaying) {
		// 			mySound = soundManager.createSound({
		// 				id: "track" + song._id,
		// 				url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id
		// 			});
		// 			mySound.play();
		// 		}
		// 		else {
		// 			mySound.pause();
		// 		}
		// 	},
		//  	ontimeout: function() {
		//  	  // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
		//  	}
		// });
	},
	"click .next": function(evt) {
		evt.preventDefault();
		let playlist = Playlists.findOne({}),
			songId = playlist.nowPlaying
			songs = playlist.songs,
			songIndex = playlist.songs.indexOf(songId);

		if (songIndex >= 0 && songIndex < songs.length - 1) {
			nextSongId = songs[songIndex + 1];
			nextTrack(nextSongId);
		}		
	}
});

function nextTrack(songId) {
	let playlist = Playlists.findOne({}),
		songs = playlist.songs,
		songIndex = songs.indexOf(songId),
		nextSongIndex = songIndex++;	
	songId = songs[nextSongIndex];

	let song = Songs.findOne(songId),
		isPlaying = Meteor.user().profile.isPlaying;

	Meteor.call("updateNowPlaying", songId);
	soundManager.url = 'swf/';
	soundManager.onready(function() {
		let mySound = soundManager.createSound({
			id: song._id,
			url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id,
			onfinish: function() {
				nextTrack(songId);
			}
		});

		if (isPlaying){
			soundManager.play(song._id);
		}
		else {
			soundManager.pause(song._id);
		}
	});
}