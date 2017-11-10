var Order = require('../models/Order');

var calendar = require('../google/calendar.js');

var async = require('async');
var fs = require('fs');
var readline = require('readline');

var auth;

module.exports = {
calendar(req, res, next) {
    fs.readFile('config/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return next(err);
        }
        calendar.authorize(JSON.parse(content), function (authObject) {
            auth = authObject;
            calendar.addEvent(auth, function (result) {
                res.send(result);
            });
        })
    })
},

new(req, res, next) {
    Order.getFormData(function(err, form) {
        if (!err)
            return res.render('pages/order/order-new', { result: {form: form} });
        else
            return next(err);
    })
},

create(req, res, next) {
    var order = req.body.order;

    Order.create(order)
        .then(next => {
            return res.send({ message: 'order created' });
        })
        .catch(err => {
            return next(err);
        })
},

get(req, res, next) {
    Order.findById(req.params.id, function (err, order) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/order', { order: order });
    })
},

getAll(req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            return next(err);
        }
        return res.render('pages/order/orders', { orders: orders });
    })
},

edit(req, res, next) {
    Order.getDetail(req.params.id, function (err, detail) {
        if (err) {
            return next(err);
        } else {
            Order.getFormData(function (err, form) {
                if (err) {
                    return next(err);
                }
                return res.render('pages/order/order-edit', { result: { form: form, detail: detail } });
            })
        }
    })
},

edit(req, res, next) {
    Order.getDetail(req.params.id, function (err, detail) {
        if (err) {
            return next(err);
        } else {
            Order.getFormData(function (err, form) {
                if (err) {
                    return next(err);
                }
                return res.render('pages/order/order-edit', { result: { form: form, detail: detail } });
            })
        }
    })
},

update(req, res, next) {
    Order.findById(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'not found'
                })
            }
            order.update(req.body) 
                .then(updated => {
                    return res.json(order);
                })
        })
        .catch(err => {
            return next(err);
        })
},

getDetail(req, res, next) {
    Order.getDetail(req.params.id, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send(result);
    })
}
};