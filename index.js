"use strict";

const express       = require('express');
const app = express();

const appConfig     = require('./config/app.config');
const expressConfig = require('./config/express.config')(app);
const mongoConfig   = require('./config/db.config')(appConfig);



app.listen(appConfig.port, (err)=>{
    if(err) return console.log(err);
    console.log('App is running on port', appConfig.port);
    })