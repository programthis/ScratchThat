import { Template } from 'meteor/templating';
import "./home.html";

Template.home.onRendered(function() {
	let windowSize = $(window).width(),
		numBars = Math.round(windowSize / 150),
		angle = 0,
		angleIncrease = 3;


	for (var i = 0; i < numBars;i++){
		$(".sound_bar").append("<span>");
		$(".sound_bar span").addClass("bar");
		$(".sound_bar span").last().css("left", i*150);
	}

	$(".bar").each(function(i) {
	    fluctuate($(this));
	});

	var interval = setInterval(function(){
		// var text = $(".play").html();
		//making it so the record spinning is dependent on the "NOW PLAYING" in the navbar
		// if (text === "NOW PLAYING:"){
		// 	angleIncrease = 3;
		// }
		// else{
		// 	angleIncrease = 0;
		// }

		angleIncrease = 3;

	    angle+=angleIncrease;
	    $(".recordContainer .record").rotate(angle);
	},17);

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

Template.home.events({
	"click .recordContainer": function(evt) {
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