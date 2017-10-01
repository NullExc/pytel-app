var Order = require('../models/Order');

var calendar = require('../google/calendar.js');

var async = require('async');
var fs = require('fs');
var readline = require('readline');

var auth;

module.exports.calendar = function (req, res, next) {
    fs.readFile('config/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return next(err);
        }

        //res.send(content);
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        //authorize(JSON.parse(content), listEvents);
        calendar.authorize(JSON.parse(content), function (authObject) {
            auth = authObject;
            calendar.addEvent(auth, function (result) {
                res.send(result);
            });
        })
    });

}

module.exports.new = function (req, res, next) {

    Order.getFormData(function (err, result) {
        if (err) {
            return next(err);
        }
        res.render('pages/order/order-new', {result: result});
    })
}

module.exports.create = function (req, res, next) {

    var order = req.body.order;

    order.state = 'arrived';

    Order.create(order, function (err, order) {
        if (err) {
            return next(err);
        } else {
            res.send({ message: 'order created' });
        }
    })
}

module.exports.get = function (req, res, next) {
    Order.findById(req.params.id, function (err, order) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/order', { order: order });
    })
}

module.exports.getAll = function (req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/orders', { orders: orders });
    })
}

module.exports.getDetail = function (req, res, next) {
    Order.getDetail(req.params.id, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send(result);
    })
}