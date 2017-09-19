var Order = require('../models/Order');
var Customer = require('../models/Customer');

var async = require('async');

module.exports.new = function (req, res, next) {

    Customer.find({}, function (err, customers) {
        if (err) {
            return next(err);
        }
        res.render('pages/order/order-new', { customers: customers });
    })
}