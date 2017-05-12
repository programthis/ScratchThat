import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layout/layout.js';
import '../../ui/home/home.js';
import "../../ui/login/login.js";
import "../../ui/register/register.js";
import "../../ui/playlist/playlist.js";

FlowRouter.route('/', {
	name: 'home',
	action() {
		BlazeLayout.render('layout', { main: 'home' });
	}
});

FlowRouter.route('/login', {
	name: 'login',
	action() {
		BlazeLayout.render('layout', { main: 'login' });
	}
});

FlowRouter.route('/register', {
	name: 'register',
	action() {
		BlazeLayout.render('layout', { main: 'register' });
	}
});

FlowRouter.route("/logout", {
	name: "logout",
	action() {
		Meteor.logout(function() {
			FlowRouter.go("home");
		});
	}
});

let privateRoutes = FlowRouter.group({
	name: "private",
	triggersEnter: [
		isUser
	]
});

privateRoutes.route("/playlist", {
	name: "playlist",
	action() {
		BlazeLayout.render('layout', { main: "playlist" });
	}
});

function isUser() {
	if (!Meteor.userId()) {
		FlowRouter.go("home");
	}
}