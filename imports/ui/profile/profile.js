import "./profile.html";

Template.profile.events({
	"click .soundCloudSync": function(evt) {
		evt.preventDefault();
		let client_id = Meteor.settings.public.sc_client_id;

		SC.initialize({
			client_id: client_id,
			redirect_uri: 'http://localhost/callback'
		});

		SC.connect(function(){
			SC.get("/me",function(me) {
				console.log(me.username);
				console.log(me);

				// SC.get("/users/" + me.username + "/playlists", function(playlists){
				//  	for (var i = 0; i < playlists.length; i++){
				//  		$("<li>" + "<a href=''>" + playlists[i].title + "</a>" + "</li>").data("playlists", playlists).appendTo("#playlists");
				//  	}
				//  	$.ajax({
				//  		type: "POST",
				//  		url: "/splaylists",
				//  		data: {
				//  			"playlists": playlists
				//  		},
				//  		dataType: "json"
				//  	});
				// });
			});
		});
	}
})