import { Template } from 'meteor/templating';

import "./navbar.html";

Template.navbar.events({
	"click .navbarMobileToggle": function(evt) {
		evt.preventDefault();
		$(".navbarMobileLinks").slideToggle("fast");
	},
	"click .navbarMobileLinks li": function() {
		$(".navbarMobileLinks").slideToggle("fast");
	}
});