import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import "./home.html";

Template.home.helpers({
	isPlaying: function() {
		if (Session.get("isPlaying")) {
			return true;
		}
		else {
			return false;
		}
	}
});