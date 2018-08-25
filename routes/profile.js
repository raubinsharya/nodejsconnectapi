"use strict";

const router        = require('express').Router();
const mongoose      = require('mongoose');
const passport      = require('passport');

const Profile = require('../models/Profile.schema');
const USER    = require('../models/User.schema');

//@route    GET api/profile/test
//@desc     Profile route test
//@access   Public
router.get('/test', (req, res)=> res.send('Great! Profile Works'));

//@route    GET api/profile
//@desc     Getting user Profile
//@access   Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            if(!profile)
                return res.status(404).json({'error': 'Profile not found'});
            res.json(profile);            
        }).catch(err => res.status(404).json(err));
});

//@route    GET api/profile
//@desc     Creating Profile of User and updating if already exists
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{

    const profileFields = getProfileData(req);
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        if(profile){
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            ).then(profile =>{res.json(profile)});
        }else{
                Profile.findOne({handle: profileFields.handle})
                    .then(profile =>{
                        if(profile)
                            res.status(400).json({err: 'Handle already exists'});
                        //new Profile(profileFields).save().then(profile => res.json(profile)).catch(err => res.json(err));
                        Profile.create(profileFields).then(profile=>res.json(profile));
                    })
                
        }
    })

});

//@route    GET api/profile/handle/:handle
//@desc     Creating Profile of User
//@access   Private
router.get('/handle/:handle', (req, res)=>{
    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name','avatar'])
    .exec()
    .then(profile =>{
        if(profile)
            res.json(profile);
        else return res.status(404).json({error: 'Profile not found'});
    })
});


//@route    GET api/profile/handle/:handle
//@desc     Creating Profile of User
//@access   Private
router.get('/user/:user', (req, res)=>{
    Profile.findOne({ user : req.params.user })
    .populate('user', ['name','avatar'])
    .exec()
    .then(profile =>{
        if(profile)
            res.json(profile);
        else return res.status(404).json({error: 'Profile not found'});
    }).catch(err => res.json({'err': 'Profile Not found'}));
});


//@route    GET api/profile/handle/:handle
//@desc     Creating Profile of User
//@access   Private
router.get('/all', (req, res)=>{
    Profile.find({})
    .populate('user', ['name','avatar'])
    .exec()
    .then(profile =>{
        if(profile)
            res.json(profile);
        else return res.status(404).json({error: 'Profile not found'});
    }).catch(err => res.json({'err': 'Profile Not found'}));
});


//@route    GET api/profile/experience
//@desc     Creating Profile of User
//@access   Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile)).catch(err => res.json(err));
        })
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const newEdu = {
                college: req.body.college,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile)).catch(err => res.json(err));
        })
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            //Getting the index of experience you want to remove from profile array
            const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
            //removing the experience from profile array after getting index
            profile.experience.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile));            
        })
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            //Getting the index of education you want to remove from profile array
            const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
            //removing the educaton from profile array after getting index
            profile.education.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile));            
        })
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOneAndRemove({user: req.user.id})
        .then(profile =>{
            USER.findOneAndRemove({_id: req.user.id})
                .then(user => res.json({'msg': "Profile Deletion successful", user}));   
        })
});

















const getProfileData = (req)=>{
    var profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //Getting skills from body of skill array and split them
    if(typeof req.body.skills != 'undefined') profileFields.skills = req.body.skills.split(',');

    //Social Links
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    return profileFields;
}

module.exports = router;