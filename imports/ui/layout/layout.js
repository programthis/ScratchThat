import { Template } from 'meteor/templating';

import "./layout.html";
import "../navbar/navbar.js";

Template.layout.onRendered(function() {
	let windowSize = $(window).width(),
		numBars = Math.round(windowSize / 150),
		angle = 0,
		angleIncrease = 3;

	for (var i = 0; i < numBars; i++) {
		$(".sound_bar").append("<span>");
		$(".sound_bar span").addClass("bar");
		$(".sound_bar span").last().css("left", i*150);
	}

	$(".bar").each(function(i) {
	    fluctuate($(this));
	});

	var interval = setInterval(function() {
		if (Meteor.user() && Meteor.user().profile) {
			let isPlaying = Meteor.user().profile.isPlaying;
			if (isPlaying) {
				angleIncrease = 3;
			}
			else {
				angleIncrease = 0;
			}
		}
	    angle+=angleIncrease;
	    $(".recordContainer .record").rotate(angle);
	}, 17);

	// var rotation = function (){
	// 	$(".recordContainer .record").rotate({
	// 		angle: 0,
	// 		animateTo: 360,
	// 		callback: rotation,
	// 		easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	// 			return c*(t/d)+b;
	// 		}
	// 	});
	// }
	// rotation();

	$(window).resize(function() {
		windowSize = $(window).width();
		numBars = Math.round(windowSize / 150);
		$(".sound_bar").empty();
		for (var i = 0; i < numBars;i++){
			$(".sound_bar").append("<span>");
			$(".sound_bar span").addClass("bar");
			$(".sound_bar span").last().css("left", i*150);
		}

		$(".bar").each(function(i) {
		    fluctuate($(this));
		});
	});
});

function fluctuate(bar) {
	let windowHeight = $(window).height() * 0.8,
		height = Math.floor(Math.random() * windowHeight) + 1;

    //Animate the equalizer bar repeatedly
    bar.animate({
        height: height
    }, function() {
        fluctuate($(this));
    });
}