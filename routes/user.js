var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
router.use(csrfProtection);


router.get('/signup', function(req, res) {
    var messages = req.flash('error');
    res.render('user/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
        //failureFlash: 'Invalid username or password.'

}), function(req, res, next) {
    if (req.session.oldUrl) {
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect('/user/profile');
    }
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
        //failureFlash: 'Invalid username or password.'

}), function(req, res, next) {
    if (req.session.oldUrl) {
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect('/');
    }
});


router.get('/profile', isLoggedIn, function(req, res) {
    res.render('user/profile');
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.userEmail = "";
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;
