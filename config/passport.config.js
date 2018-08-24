"use strict";

const { Strategy, ExtractJwt }  = require('passport-jwt');
const mongoose                  = require('mongoose');
const User = mongoose.model('user');
const key  = require('../config/app.config').secretKey;


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey    = key;

module.exports = (passport) =>{
    passport.use(new Strategy(opts, (jwt_payload, done) =>{
        User.findById(jwt_payload.id)
            .then(user=>{
                if(user)
                    return done(null, user);
                else return done(null, false);
            })
            
    }));
}

