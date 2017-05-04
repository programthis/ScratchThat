import { Template } from 'meteor/templating';
import "./home.html";

Template.home.events({
	"click .recordContainer.loggedIn": function(evt) {
		evt.preventDefault();
		let isPlaying = Meteor.user().profile.isPlaying;
		if (isPlaying) {
			isPlaying = false;
		}
		else {
			isPlaying = true;
		}
		Meteor.call("updateUserProfile", "isPlaying", isPlaying);
	}
});