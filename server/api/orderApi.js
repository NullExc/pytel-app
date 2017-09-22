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

module.exports.create = function (req, res, next) {

    var order = req.body.order;

    order.state = 'arrived';

    Order.create(order, function (err, order) {
        if (err) {
            return next(err);
        } else {
            res.send({message: 'order created'});
        }
    })
}

module.exports.get = function (req, res, next) {
    Order.findById(req.params.id, function (err, order) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/order',{ order: order });
    })
}

module.exports.getAll = function (req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/orders',{ orders: orders });
    })
}

module.exports.getDetail = function (req, res, next) {

}