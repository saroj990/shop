var mongoose = require('mongoose');
var Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
	new Product({
	  imagePath : 'spidy',
	  itle : 'Spider man the real hero!!',
		description: 'Spider man is a comics character, A super hero who is not a super man',
		price : 10
	}),
	new Product({
	  imagePath : 'spidy',
	  title : 'Amazing Spider man!!',
		description: 'Spider man is a comics character, A super hero who is not a super man',
		price : 11
	}),
	new Product({
	  imagePath : 'spidy',
	  title : 'Spider man the real hero!!',
		description: 'Spider man is a comics character, A super hero who is not a super man',
		price : 20
	}),
	new Product({
	  imagePath : 'spidy',
	  title : 'Spider man the real hero!!',
		description: 'Spider man is a comics character, A super hero who is not a super man',
		price : 23
	})
];

var done = 0;
for (var i=0;i<products.length;i++){
	products[i].save(function(err){
		console.log("inserted!!")
	});
}