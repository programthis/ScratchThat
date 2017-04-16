import { Template } from 'meteor/templating';
import "./home.html";

Template.home.onRendered(function() {
	var windowSize = $(window).width();
	var numBars = Math.round(windowSize / 150);
	for (var i = 0; i < numBars;i++){
		$(".sound_bar").append("<span>");
		$(".sound_bar span").addClass("bar");
		$(".sound_bar span").last().css("left", i*150);
	}

	$(".bar").each(function(i) {
	    fluctuate($(this));
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