const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../../models/User'); // want to go out of api folder.. out of route folder.. and under User folder

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Registers a user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => { // promise
        if(user) { // if there is a user with this email
            return res.status(400).json({email: 'Email already exists'})
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // size
                r: 'pg', // rating
                d: 'mm' // Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            }); // when created a resource with mongoose, use new and then model name (User)

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                })
            })
        }
    })
});

module.exports = router;
