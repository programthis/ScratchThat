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

	var angle = 0;
	var angleIncrease = 3;

	var interval = setInterval(function(){
		var text = $(".play").html();
		//making it so the record spinning is dependent on the "NOW PLAYING" in the navbar
		// if (text === "NOW PLAYING:"){
		// 	angleIncrease = 3;
		// }
		// else{
		// 	angleIncrease = 0;
		// }

		angleIncrease = 3;

	    angle+=angleIncrease;
	    $("#record_logo").rotate(angle);
	},17);
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