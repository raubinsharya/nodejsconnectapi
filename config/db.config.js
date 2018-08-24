"use strict";
const mongoose = require('mongoose');

// activating Promises for mongoose
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.dbURL, {
        useNewUrlParser: true 
    }).then(() => {
      console.log(`mongodb connected to ${config.dbURL}`);
    }).catch((e) => {
      console.log('Mongodb '+e.message);
    });
};
