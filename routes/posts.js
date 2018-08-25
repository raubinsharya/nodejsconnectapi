"use strict";

const router    = require('express').Router();
const passport  = require('passport');
const Post      = require('../models/Posts.schema');

//@route    GET api/post/test
//@desc     Testing post
//@access   Public
router.get('/test', (req, res)=>{
    res.send('Great! Post work');
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.create({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    }).then(post => res.json(post)).catch(err => res.json(err));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.get('/', (req, res)=>{
    Post.find({})
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.json(err));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.get('/:post_id', (req, res)=>{
    Post.findById(req.params.post_id)
    .then(posts => res.json(posts))
    .catch(err => res.json({err: 'Post not found'}));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.get('/user/:user', (req, res)=>{
    Post.find({user: req.params.user})
    .then(posts => res.json(posts))
    .catch(err => res.json({err: 'Post not found'}));
});


//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.findByIdAndRemove({ _id: req.params.id})
        .where({user: req.user.id})
        .then(post =>{
           if(post)
            res.json(post);
            else res.json({'err': 'No post found for this id'});
        })
        .catch(err => res.json({err: 'No post found for deletion'}));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post =>{
            if(post && post.likes.filter(item => item.user == req.user.id ).length > 0)
                res.json({err: 'You have already liked this post'});
            else {
                post.likes.unshift({user: req.user.id});
                post.save().then(post => res.json(post));
            } 
        })
        .catch(err => res.json({err: 'Post not found for this id'}));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/like/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post =>{
            if(post && post.likes.filter(item => item.user == req.user.id ).length > 0){
                 
                const removeIndex = post.likes.map(item => item._id.toString())
                .indexOf(req.user.id);
                console.log(removeIndex);
                
                post.likes.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            }               
            else {
               
                res.json({err: 'You have not liked this post'});
            } 
        })
        .catch(err => res.json({err: 'Post not found for this id'}));
});

//@route    POST api/post/comment/:post_id
//@desc     Adding Comment to post
//@access   Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.findById(req.params.post_id)
        .then(post =>{
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));
        }).catch(err => res.json({err: 'Post not found'}));
});

//@route    GET api/profile/education
//@desc     Creating Profile of User
//@access   Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Post.findById(req.params.post_id)
        .then(post =>{
            if( post &&  post.comments.filter(item => (item.user == req.user.id && item._id == req.params.comment_id) ).length == 0 )
                return res.status(404).json({err: 'No comment to delete'});
            else {
                const removeIndex = post.comments.map(item => item._id.toString())
                    .indexOf(req.params.comment_id);
                    post.comments.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));              
            }
            

            


            //post.save().then(post => res.json(post));
        }).catch(err => res.json({err: 'Post not found'}));
});



module.exports = router;