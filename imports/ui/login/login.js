import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from "meteor/kadira:flow-router";

import "./login.html";

Template.login.onRendered(function() {
	$("#li-email").focus();
});

Template.login.events({
	"submit form": function(evt, template) {
		evt.preventDefault();
		let email = template.find("#li-email").value;
		let password = template.find("#li-password").value;
		Meteor.loginWithPassword(email, password, function() {
			FlowRouter.go("home");
		});
	}
});