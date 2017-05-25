import { Template } from 'meteor/templating';
import { Songs } from '../../api/songs.js';
import { Playlists } from '../../api/playlists.js';

import "./layout.html";
import "../navbar/navbar.js";

var mySound;

Template.layout.onRendered(function() {
	let windowSize = $(window).width(),
		numBars = Math.round(windowSize / 150),
		angle = 0,
		angleIncrease = 3;

	for (var i = 0; i < numBars; i++) {
		$(".sound_bar").append("<span>");
		$(".sound_bar span").addClass("bar");
		$(".sound_bar span").last().css("left", i*150);
	}

	$(".bar").each(function(i) {
	    fluctuate($(this));
	});

	var interval = setInterval(function() {
		if (Meteor.user() && Meteor.user().profile) {
			let isPlaying = Meteor.user().profile.isPlaying;
			if (isPlaying) {
				angleIncrease = 3;
			}
			else {
				angleIncrease = 0;
			}
		}
	    angle+=angleIncrease;
	    $(".recordContainer .record").rotate(angle);
	}, 17);

	$(window).resize(function() {
		windowSize = $(window).width();
		numBars = Math.round(windowSize / 150);
		$(".sound_bar").empty();
		for (var i = 0; i < numBars;i++){
			$(".sound_bar").append("<span>");
			$(".sound_bar span").addClass("bar");
			$(".sound_bar span").last().css("left", i*150);
		}

		$(".bar").each(function(i) {
		    fluctuate($(this));
		});
	});
});

Template.layout.events({
	"click .play, click .recordContainer.loggedIn": function(evt) {
		evt.preventDefault();
		let isPlaying = Meteor.user().profile.isPlaying,
			playlist = Playlists.findOne({});

		if (playlist) {
			let songs = playlist.songs,
				songId,
				song;
		
			playlist.nowPlaying ? songId = playlist.nowPlaying : songId = songs[0];
			song = Songs.findOne(songId);

			if (isPlaying) {
				isPlaying = false;
			}
			else {
				isPlaying = true;
			}
			Meteor.call("updateUserProfile", "isPlaying", isPlaying);
			Meteor.call("updateNowPlaying", songId);

			soundManager.setup({
				url: 'swf/',
				onready: function() {
					mySound = soundManager.createSound({
						id: song._id,
						url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id,
						onfinish: function() {
							let songIndex = playlist.songs.indexOf(songId),
								nextSongId;
							if (songIndex >= 0 && songIndex < songs.length - 1) {
								nextSongId = songs[songIndex + 1];
							}
							else if (songIndex >= songs.length - 1) {
								nextSongId = songs[0];
							}
							nextTrack(nextSongId);
						}
					});

					if (isPlaying){
						mySound.play();
					}
					else {
						mySound.pause();
					}
				}
			});
		}
		else {
			console.log("Sorry, no playlist available...");
		}
	},
	"click .next": function(evt) {
		evt.preventDefault();
		let playlist = Playlists.findOne({}),
			songId = playlist.nowPlaying,
			songs = playlist.songs,
			songIndex = playlist.songs.indexOf(songId),
			nextSongId;

		if (songIndex >= 0 && songIndex < songs.length - 1) {
			nextSongId = songs[songIndex + 1];
		}
		else if (songIndex >= songs.length - 1) {
			nextSongId = songs[0];
		}
		nextTrack(nextSongId);
	},
	"click .skipToSong": function(evt) {
		evt.preventDefault();
		let songId = this._id,
			song = Songs.findOne(songId);

		if (mySound) {
			mySound.stop();	
		}

		Meteor.call("updateUserProfile", "isPlaying", true);
		Meteor.call("updateNowPlaying", songId);

		soundManager.setup({
			url: 'swf/',
			onready: function() {
				mySound = soundManager.createSound({
					id: song._id,
					url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id,
					onfinish: function() {
						let songIndex = playlist.songs.indexOf(songId),
							nextSongId;
						if (songIndex >= 0 && songIndex < songs.length - 1) {
							nextSongId = songs[songIndex + 1];
						}
						else if (songIndex >= songs.length - 1) {
							nextSongId = songs[0];
						}
						nextTrack(nextSongId);
					}
				});
				mySound.play();
			}
		});
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
	if (mySound) {
		mySound.stop();	
	}
	soundManager.setup({
		url: 'swf/',
		onready: function() {
			mySound = soundManager.createSound({
				id: song._id,
				url: song.url + "?client_id=" + Meteor.settings.public.sc_client_id,
				onfinish: function() {
					let songIndex = playlist.songs.indexOf(songId),
						nextSongId;
					if (songIndex >= 0 && songIndex < songs.length - 1) {
						nextSongId = songs[songIndex + 1];
					}
					else if (songIndex >= songs.length - 1) {
						nextSongId = songs[0];
					}
					nextTrack(nextSongId);
				}
			});

			if (isPlaying){
				mySound.play();
			}
			else {
				mySound.pause();
			}
		}
	});
}

function fluctuate(bar) {
	let windowHeight = $(window).height() * 0.8,
		height = Math.floor(Math.random() * windowHeight) + 1;

    //Animate the equalizer bar repeatedly
    bar.animate({
        height: height
    }, function() {
        fluctuate($(this));
    });
}