import { Template } from 'meteor/templating';
import { FlowRouter } from "meteor/kadira:flow-router";

import "./register.html";

Template.register.onRendered(function() {
	$("#rg-email").focus();
});

Template.register.events({
	"submit form": function(evt, template) {
		evt.preventDefault();
		let email = template.find("#rg-email").value;
		let password = template.find("#rg-password").value;
		let isAdmin = false;

		if (email === "admin@admin.com") {
			isAdmin = true;
		}

		Accounts.createUser({
			email: email,
			password: password,
			profile: {
				isAdmin: isAdmin
			}
		}, function() {
			FlowRouter.go("home");
		});
	}
});