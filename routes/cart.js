var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order')

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
    res.redirect("/shopping-cart");
});

var findCartKeyFromProductId = function(cartItems, productId) {
    if (cartItems && productId) {
        for (key in cartItems)
            console.log(cartItems[key].item._id);
    }
};

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {
        total: cart.totalPrice,
        errMsg: errMsg,
        noErr: !errMsg
    });
})

router.post('/checkout', isLoggedIn, function(req, res, next) {

    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_w8fTGMhdl5hlmdcTAoxmacQ3"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });

        order.save(function(err, result) {
            if (err) {
                req.flash('error', 'error occured!!');
                return res.redirect('/checkout');
            }

            req.flash('success', 'successfully bought product');
            req.session.cart = null;
            res.redirect('/');
        });
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
module.exports = router;
