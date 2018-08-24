"use strict";

const router    = require('express').Router();
const gravatar  = require('gravatar');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const passport  = require('passport');


const User = require('../models/User.schema');
const secretKey = require('../config/app.config').secretKey;

//@route    GET api/user/test
//@desc     Test user route
//@access   Public
router.get('/test', (req, res)=>{
    res.send('Great! User Works');
});


//@route    GET api/user/register
//@desc     Register User
//@access   Public
router.post('/register', (req,res)=>{
    const avatar = gravatar.url(req.body.email, {
        s: '200', //size of avatar
        r: 'pg', //Rating
        d: 'mm' //Default
    });

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if (err)
                throw err;
            User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    avatar
                }).then(user=>{
                        res.json(user);
                }).catch(err =>{
                    return res.status(404).json(err.errmsg);
                });
        });
    });
});

//@route    GET api/user/login
//@desc     Login User && returning JWT Token
//@access   Public
router.post('/login', (req, res)=>{
    User.findOne({email:req.body.email})
        .then(user =>{
            if(!user)
                return res.status(404).json({email: 'User not found'});
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch =>{
                    if(!isMatch)
                        return res.status(400).json({'err':'Password incorrect'});
                        else{
                            const payload = { id: user.id , name: user.name };
                            jwt.sign(payload, secretKey, { expiresIn: '24h' } , (err, token) =>{
                                if(err) res.json(err);
                                else res.json({success: true, 'token': 'bearer '+ token});
                            });
                            
                        }
                })
        })

});


//@route    GET api/user/login
//@desc     Login User && returning JWT Token
//@access   Public
router.get('/current', passport.authenticate('jwt', {session: false}), (req,res)=>{
    res.json({msg: req.user });
})





module.exports = router;