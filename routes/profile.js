"use strict";

const router        = require('express').Router();
const mongoose      = require('mongoose');
const passport      = require('passport');

//@route    GET api/profile/test
//@desc     Profile route test
//@access   Public
router.get('/test', (req,res)=> res.send('Great! Profile Works'));

//@route    GET api/user/login
//@desc     Login User && returning JWT Token
//@access   Public



module.exports = router;