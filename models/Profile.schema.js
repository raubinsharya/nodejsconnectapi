"use strict";

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    webiste: {
        type: String
    },
    location: {
        type: String
    },

    status: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        required: true
    },

    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
            },
            current: {
                type:Boolean,
                default: false
            },
            description: {
                type:String
            }
        }
    ],

    bio: {
        type: String
    },

    githubusername: {
        type: String
    },

    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
            },
            current: {
                type:Boolean,
                default: false
            },
            description: {
                type:String
            }
        }
    ],

    social: {
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        }
    },

    date: {
        type: Date,
        default: Date.now
    }



});

module.exports = mongoose.model('profile',ProfileSchema);