var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
    var products = Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
        };
        res.render('shop/index', {
            title: 'Express',
            products: productChunks
        });
    });
});

router.get('/addToCart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {
        items: {}
    });
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/shopping-cart', function(req, res, next) {
    console.log("request session");
    console.log(req.session);
    if (!req.session.cart) {
        res.render('shop/shopping-cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    var products = cart.generateArray();


    res.render('shop/shopping-cart', {
        products: products,
        totalPrice: cart.totalPrice
    });
});

router.get('/delete-cart-item/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = req.session.cart;
    //findCartKeyFromProductId(cart.items, productId);
    console.log("=================deleting cart items=================");
    console.log(cart.items);
    res.redirect("/shopping-cart");
});

var findCartKeyFromProductId = function(cartItems, productId) {
    if (cartItems && productId) {
        for (key in cartItems)
            console.log(cartItems[key].item._id);
    }
};

module.exports = router;
