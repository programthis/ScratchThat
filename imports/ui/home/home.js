import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Songs } from '../../api/songs.js';
import { Playlists } from '../../api/playlists.js';

import "./home.html";

Template.home.helpers({
	isPlaying: function() {
		if (Session.get("isPlaying")) {
			return true;
		}
		else {
			return false;
		}
	},
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
	},
});