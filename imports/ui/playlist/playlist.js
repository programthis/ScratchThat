import "./playlist.html";

Template.playlist.events({
	"click .syncSoundCloud": function(evt) {
		evt.preventDefault();
		Meteor.call("syncSoundCloud");
	}
})