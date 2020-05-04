import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Songs } from '../../api/songs.js';
import { Playlists } from '../../api/playlists.js';

import "./layout.html";
import "../navbar/navbar.js";

var mySound;

Template.layout.onCreated(function() {
	Session.set({"volume": 100});
	$(window).on('keyup', function(evt) {
		let keyCode = evt.keyCode;
		console.log(keyCode);
		if (keyCode === 32) {
			playSong();
		}
	});
});

Template.layout.onRendered(function() {
	let windowSize = $(window).width(),
		numBars = Math.round(windowSize / 150),
		angle = 0,
		angleIncrease = 3;
	$(".bar").removeClass();
	for (var i = 0; i < numBars; i++) {
		$(".sound_bar").append("<span>");
		$(".sound_bar span").addClass("bar");
		$(".sound_bar span").last().css("left", i*150);
	}
	$(".bar").each(function(i) {
	    fluctuate($(this));
	});
	var interval = setInterval(function() {
		let isPlaying = Session.get("isPlaying");
		if (isPlaying) {
			angleIncrease = 3;
		}
		else {
			angleIncrease = 0;
		}
	    angle+=angleIncrease;
	    $(".recordContainer .record").rotate(angle);
	}, 17);
	$(window).resize(function() {
		windowSize = $(window).width();
		numBars = Math.round(windowSize / 150);
		$(".sound_bar").empty();
		$(".bar").removeClass();
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

Template.layout.helpers({
	isPlaying: function() {
		if (Session.get("isPlaying")) {
			return true;
		}
		else {
			return false;
		}
	}
});


Template.layout.events({
	"click .play, click .recordContainer": function(evt) {
		evt.preventDefault();
		playSong();

		//static noise generator
		var c = document.createElement("c");
		var ctx = c.getContext("2d", {alpha: false});       // context without alpha channel.
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.width = window.innerWidth;
		var idata = ctx.createImageData(c.width, c.height); // create image data
		var buffer32 = new Uint32Array(idata.data.buffer);  // get 32-bit view

		(function loop() {
			noise(ctx);
			requestAnimationFrame(loop)
		})()

		function noise(ctx) {
			var len = buffer32.length - 1;
			while(len--) buffer32[len] = Math.random() < 0.5 ? 0 : -1>>0;
			ctx.putImageData(idata, 0, 0);
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
		let playlist = Playlists.findOne({}),
			songs = playlist.songs,
			songId = this._id,
			song = Songs.findOne(songId);
		if (mySound) {
			mySound.stop();	
		}
		Session.set({"isPlaying": true});
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
				mySound.setVolume(Session.get("volume"));
				mySound.play();
			}
		});
	},
	"input .volumeSlider": function(evt) {
		evt.preventDefault();
		let volume = $(evt.target).val();
		Session.set({"volume": volume});
		if (mySound) {
			mySound.setVolume(volume);
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
		isPlaying = Session.get("isPlaying");

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
				mySound.setVolume(Session.get("volume"));
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

function playSong() {
	let isPlaying = Session.get("isPlaying"),
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
		Session.set({"isPlaying": isPlaying});
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
				if (isPlaying) {
					mySound.setVolume(Session.get("volume"));
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
}