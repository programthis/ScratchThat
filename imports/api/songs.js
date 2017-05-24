import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Songs = new Mongo.Collection("songs");

Songs.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Song Name"
	},
	url: {
		type: String,
		label: "Song Url",
		unique: true
	},
	userId: {
		type: String,
		label: "User ID"
	},
	sourceUrl: {
		type: String,
		label: "Source URL",
		unique: true
	}
}));

if (Meteor.isServer) {
	Meteor.publish("songs", function() {
		return Songs.find({});
	});
}

Meteor.methods({
	addSong: function(name, url, sourceUrl) {
		return Songs.insert({
			name: name,
			url: url,
			userId: Meteor.userId(),
			sourceUrl: sourceUrl
		});
	}
});