import "./profile.html";

Template.profile.events({
	"click .syncSoundCloud": function(evt) {
		evt.preventDefault();
		Meteor.call("syncSoundCloud");
	}
})