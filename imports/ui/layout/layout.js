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

	// soundManager.onready(function() {
	// 	songs.forEach(function(song) {
	// 		url = song.url;
	// 		soundManager.createSound({
	// 			id: 'track_' + song.id,
	// 			url: url + "?client_id=" + "dc5060a513c6d8d687f8649163b09c8e",
	// 			// type: "audio/mp3",
	// 			onplay:function(){
	// 				$(".player").addClass("playing");
	// 				var maxlength_title = track.title;
	// 				if (maxlength_title.length > 50){
	// 					maxlength_title = maxlength_title.substring(0,50) + "...";
	// 				}
	// 				$("#title").text(maxlength_title);
	// 				var link = document.getElementById("title");
	// 				link.setAttribute("href", track.permalink_url);
	// 			},
	// 			onresume:function(){
	// 				$(".player").addClass("playing");
	// 			},
	// 			onpause:function(){
	// 				$(".player").removeClass("playing");
	// 			},
	// 			onfinish:function(){
	// 				nextTrack();
	// 			}
	// 		});
	// 	});


	// 	SC.get('/users/' + user_id + '/playlists', function(playlist) {
	// 		// shuffle(playlist[playlist_id].tracks);
	// 		// $.each(playlist[playlist_id].tracks, function(index,track) {
	// 		// 	$("<li>" + track.title + "</li>").data("track", track).appendTo(".tracks");
	// 		// 	url = track.stream_url;

	// 		// 	soundManager.createSound({
	// 		// 		id: 'track_' + track.id,
	// 		// 		url: url + "?client_id=" + "dc5060a513c6d8d687f8649163b09c8e",
	// 		// 		// type: "audio/mp3",
	// 		// 		onplay:function(){
	// 		// 			$(".player").addClass("playing");
	// 		// 			var maxlength_title = track.title;
	// 		// 			if (maxlength_title.length > 50){
	// 		// 				maxlength_title = maxlength_title.substring(0,50) + "...";
	// 		// 			}
	// 		// 			$("#title").text(maxlength_title);
	// 		// 			var link = document.getElementById("title");
	// 		// 			link.setAttribute("href", track.permalink_url);
	// 		// 		},
	// 		// 		onresume:function(){
	// 		// 			$(".player").addClass("playing");
	// 		// 		},
	// 		// 		onpause:function(){
	// 		// 			$(".player").removeClass("playing");
	// 		// 		},
	// 		// 		onfinish:function(){
	// 		// 			nextTrack();
	// 		// 		}
	// 		// 	});
	// 		// });

	// 		$(".tracks li").bind("click", function(){
	// 			var $track = $(this), data = $track.data("track"), playing = $track.is(".active");
	// 			if (playing){
	// 				soundManager.pause("track_" + data.id);
	// 			}
	// 			else{
	// 				if ($track.siblings("li").hasClass("active")){
	// 					soundManager.stopAll();
	// 				}
	// 				soundManager.play("track_" + data.id);
	// 			}
	// 			$track.toggleClass("active").siblings("li").removeClass("active");
				
	// 		});

	// 		$(".play, .pause").bind("click", function(){
				
	// 			if ($("li").hasClass("active") == true){
					
	// 				soundManager.togglePause("track_" + $("li.active").data("track").id);
	// 			}
	// 			else{
	// 				$("li:first").click();
	// 			}
	// 		});
	// 		$("li:nth-child(1)").click();

	// 		//binding the space bar so it can also be used to play or pause the music
	// 		$(window).keypress(function(e) {
	// 		  if (e.keyCode == 0 || e.keyCode == 32) {
	// 		    if ($("li").hasClass("active") == true){
					
	// 				soundManager.togglePause("track_" + $("li.active").data("track").id);
	// 			}
	// 			else{
	// 				$("li:first").click();
	// 			}
	// 			var text = $(".play").html();
	// 			console.log(text);
	// 			if (text === "NOW PLAYING:"){
	// 				$(".play").text("PAUSED");
	// 			}
	// 			else{
	// 				$(".play").text("NOW PLAYING:");
	// 			}
	// 		  }
	// 		});

	// 		$(".play").click(function(){
	// 			var text = $(".play").html();
	// 			console.log(text);
	// 			if (text === "NOW PLAYING:"){
	// 				$(".play").text("PAUSED");
	// 			}
	// 			else{
	// 				$(".play").text("NOW PLAYING:");
	// 			}
	// 		});

	// 	});

	
	// 	var nextTrack = function(){
	// 		soundManager.stopAll();
	// 		if ( $('li.active').next().click().length == 0 ) {
	// 			$('.tracks li:first').click();
	// 		}
	// 	}

	// 	function shuffle(array) {
	// 	    var counter = array.length, temp, index;

	// 	    // While there are elements in the array
	// 	    while (counter > 0) {
	// 	        // Pick a random index
	// 	        index = Math.floor(Math.random() * counter);

	// 	        // Decrease counter by 1
	// 	        counter--;

	// 	        // And swap the last element with it
	// 	        temp = array[counter];
	// 	        array[counter] = array[index];
	// 	        array[index] = temp;
	// 	    }

	// 	    return array;
	// 	}
	// });


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