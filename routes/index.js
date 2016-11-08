var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order')

/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success');
    var products = Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
        };
        res.render('shop/index', {
            title: 'Express',
            products: productChunks,
            successMsg: successMsg,
            noMessage: successMsg && !successMsg.length
        });
    });
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
module.exports = router;
