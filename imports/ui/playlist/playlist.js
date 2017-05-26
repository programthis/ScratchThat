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

Template.playlist.onRendered(function() {
	$(".songSearchInput").focus();
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
	},
	isPlaying: function() {
		let songId = this._id,
			playlist = Playlists.findOne({});
		if (playlist) {
			let nowPlaying = playlist.nowPlaying;
			if (nowPlaying === songId) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
});

Template.playlist.events({
	"keyup .songSearchInput": _.debounce(function(evt) {
		evt.preventDefault();
		let text = $(".songSearchInput").val();
		Meteor.call("searchSong", text, function(error, result) {
			if (error) {
			}
			else {
				let songs = result;
				$(".result").remove();
				songs.forEach(function(song) {
					let result = $("<div class='result' name='" + song.title + "' stream_url='" + song.stream_url + "' artwork_url='" + song.artwork_url + "'> \
										<div class='resultImage'><img src='" + song.artwork_url + "'></img></div>"
										+ song.title +
									"</div>");
					$(".songSearchResults").append(result);
				});
			}
		});
	}, 400),
	"click .result": function(evt) {
		evt.preventDefault();
		let name = $(evt.currentTarget).attr("name"),
			stream_url = $(evt.currentTarget).attr("stream_url"),
			artwork_url = $(evt.currentTarget).attr("artwork_url");
		Meteor.call("addSong", name, stream_url, artwork_url, function(error, result) {
			if (error) {
			}
			else {
				$(".result").remove();
				Meteor.call("addSongToPlaylist", result);
			}
		});
	},
	"click .syncSoundCloud": function(evt) {
		evt.preventDefault();
		Meteor.call("syncSoundCloud");
	},
	"click .delete": function(evt) {
		evt.preventDefault();
		let songId = this._id;
		Meteor.call("deleteSong", songId);
	},
	"submit .songSearchForm": function(evt) {
		evt.preventDefault();
	}
})