var Order = require('../models/Order');

var calendar = require('../google/calendar.js');

var async = require('async');
var fs = require('fs');
var readline = require('readline');

var auth;

module.exports = {
calendar(req, res) {
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

new(req, res) {
    Order.getFormData(function(err, form) {
        if (!err)
            return res.render('pages/order/order-new', { result: {form: form} });
        else
            return next(err);
    })
},

create(req, res) {
    var order = req.body.order;

    Order.create(order)
        .then(next => {
            return res.send({ message: 'order created' });
        })
        .catch(err => {
            return next(err);
        })
},

get(req, res) {
    Order.findById(req.params.id) 
        .then(order => {
            return res.render('pages/order/order', { order: order });
        })
        .catch(err => {
            return next(err);
        })
},

getAll(req, res) {
    Order.find({})
        .then(orders => {
            return res.render('pages/order/orders', { orders: orders });
        })
        .catch(err => {
            return next(err);
        })
},

edit(req,res) {
    Order.getDetail(req.params.id)
        .then(detail => {
            return Order.getFormData()
                    .then(form => {
                        return res.render('pages/order/order-edit', { result: { form: form, detail: detail } });
                    })
                    .catch(err => {
                        return next(err);
                    })
        })
        .catch(err => {
            return next(err);
        })
},

/*edit(req, res) {
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
},*/

update(req, res) {
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

getDetail(req, res) {
    Order.getDetail(req.params.id)
        .then(result => {
            return res.send(result);
        }) 
        .catch(err => {
            return next(err);
        })
}
};