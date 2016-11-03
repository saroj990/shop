var passport = require("passport");
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

//Serialize and Deserialize user info
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(null, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done) {

    //Added validation
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({
        min: 4
    });

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({
        'email': email
    }, function(err, user) {
        if (err) {
            return done(err);
        }

        //if found a user by email
        if (user) {
            return done(null, false, {
                message: "Email has already been taken!!"
            });
        } else {

            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function(err, result) {
                if (err) {
                    return done(err);
                } else {
                    return done(null, newUser);
                }
            });
        }
    });
}));


passport.use('local.signin', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    User.findOne({
        'email': email
    }, function(err, user) {
        if (err) {
            return done(err);
        }

        //if found a user by email
        if (!user) {
            return done(null, false, {
                message: "No user found!!"
            });
        }

        if (!user.validPassword(password)) {
            return done(null, false, {
                message: "Wrong password"
            })
        }
        return done(null, user);
    });
}));
