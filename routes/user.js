"use strict";

const router    = require('express').Router();

const UserSchema = require('../models/User.schema');


router.get('/', (req,res)=>{
    res.send('Hello World');
})




module.exports = router;