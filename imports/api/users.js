import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Schemas = {};
Schemas.UserProfile = new SimpleSchema({
    name: {
        type: String,
        label: "User's name",
        optional: true
    },
    isPlaying: {
    	type: Boolean,
    	label: "isPlaying Flag",
    	defaultValue: false
    },
    isAdmin: {
    	type: Boolean,
    	label: "isAdmin Flag",
    	defaultValue: false
    }
});

Meteor.users.attachSchema(new SimpleSchema({
	emails: {
	    type: [Object]
	},
	"emails.$.address": {
	    type: String,
	    regEx: SimpleSchema.RegEx.Email
	},
	"emails.$.verified": {
	    type: Boolean
	},
	createdAt: {
	    type: Date
	},
	verified: {
	    type: Boolean,
	    optional: true
	},
	profile: {
	    type: Schemas.UserProfile
	},
	roles: {
		type: Array,
		label: "User Roles",
		defaultValue: []
	},
	"roles.$": {
        type: String,
        label: "User Roles String Type"
    },
	services: {
	    type: Object,
	    optional: true,
	    blackbox: true
	}
}));


if (Meteor.isServer) {
	Meteor.publish("users", function() {
		return Meteor.users.find({});
	});

	Meteor.publish(null, function () {
		if (this.userId) {
			return Meteor.roleAssignment.find({ 'user._id': this.userId });
		}
		else {
			this.ready()
		}
	});

	export const toggleUserAdmin = new ValidatedMethod({
	    name: "toggleUserAdmin",
	    validate: new SimpleSchema({
	        userId: { type: String }
	    }).validator(),
	    run({ userId }) {
	        let user = Meteor.user();
	        if (!user || !user.profile.isAdmin) {
	        	throw new Meteor.Error(403, "Access denied");
	        }
	        if (Roles.userIsInRole(userId, "admin")) {
	        	Roles.removeUsersFromRoles(userId, "admin");
	        }
	        else {
	        	Roles.createRole("admin", {unlessExists: true});
	        	Roles.addUsersToRoles(userId, "admin");
	        }
	    }
	});
}

Meteor.methods({
	updateUserProfile: function(attribute, value) {
		Meteor.users.update({_id: Meteor.userId()}, {
			$set: {
				["profile." + attribute]: value
			}
		});
	}
});