var mongoose = require('mongoose');
var Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'http://nop4you.com/content/images/thumbs/0001494_search-engine-powered-by-mongodb.jpeg',
        title: 'MongoDB',
        description: 'MongoDB is an open-source document database that provides high performance, high availability, and automatic scaling. MongoDB obviates the need for an Object Relational Mapping (ORM) to facilitate development.',
        price: 10
    }),
    new Product({
        imagePath: 'https://media.isl.co/2016/07/angular-js.png',
        title: 'AngularJs',
        description: 'AngularJS is a very powerful JavaScript Framework. It is used in Single Page Application (SPA) projects. It extends HTML DOM with additional attributes and makes it more responsive to user actions. AngularJS is open source, completely free, and used by thousands of developers around the world. It is licensed under the Apache license version 2.0.',
        price: 11
    }),
    new Product({
        imagePath: 'https://www.filepicker.io/api/file/eZfHVHHRj6x3hKY7XgTr',
        title: 'ReactJs',
        description: 'React is front end library developed by Facebook. It is used for handling view layer for web and mobile apps. ReactJS allows us to create reusable UI components. It is currently one of the most popular JavaScript libraries and it has strong foundation and large community behind it.',
        price: 20
    }),
    new Product({
        imagePath: 'http://benznext.com/wp-content/uploads/2015/04/nodejs_logo_green.jpg',
        title: 'Spider man the real hero!!',
        description: 'Node.js® is a JavaScript runtime built on Chrome V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js package ecosystem, npm, is the largest ecosystem of open source libraries in the world.',
        price: 23
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err) {
        console.log("inserted!!")
    });
}
