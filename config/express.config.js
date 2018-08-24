"use strict";

const morgan                      = require('morgan');
const bodyParser                  = require('body-parser');
const compression                 = require('compression');
const helmet	                    = require('helmet');
const passport                    = require('passport');


const user    = require('../routes/user');
const profile = require('../routes/profile');


module.exports = (app) =>{
    app.use(compression());	
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended:false }));
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(passport.initialize());
    require('../config/passport.config')(passport);
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
          res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
          return res.status(200).json({});
        }
        next();
      });
    
    app.use('/api/user',user);
    app.use('/api/profile',profile);
    
    
}