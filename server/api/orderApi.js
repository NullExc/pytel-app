var Order = require('../models/Order');
var OrderType = require('../models/OrderType');
var WorkType = require('../models/WorkType');

var calendar = require('../google/calendar.js');

var async = require('async');
var fs = require('fs');
var readline = require('readline');

var moment = require('moment');

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
        Order.getFormData(function (err, form) {
            if (!err)
                return res.render('pages/order/order-new', { result: { form: form } });
            else
                return next(err);
        })
    },

    create(req, res, next) {
        var order = req.body.order;

        // Remove escapes (quotas) from JSON string
        var escapeJSON = function (str) {
            return str.replace(/\"/g, '\\\"');
        };
        order.description = escapeJSON(order.description); // Removes quotas from description

        Order.create(order)
            .then(created => {
                return res.send({ message: 'order created', id: created._id });
            })
            .catch(err => {
                return next(err);
            })
    },

    delete(req, res, next) {

        Order.remove({ _id: req.params.id })
            .then(removed => {
                return res.json({ message: 'order deleted' });
            })
            .catch(err => {
                return next(err);
            })
    },

    get(req, res, next) {
        Order.getDetail(req.params.id, false, function (err, detail) {
            if (err) {
                return next(err);
            } else {
                return res.render('pages/order/order', { detail: detail });
            }
        })
    },

    getAll(req, res, next) {
        Order.find({})
            .then(orders => {
                return res.render('pages/order/orders', { orders: orders });
            })
            .catch(err => {
                return next(err);
            })
    },

    edit(req, res, next) {
        Order.getDetail(req.params.id, false, function (err, detail) {
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
        console.log(req.params.id, JSON.stringify(req.body));
        Order.update({ _id: req.params.id }, req.body.order, { multi: false, upsert: false })
            .then(order => {
                res.status(200).send({ message: 'Order updated successfully to ' + JSON.stringify(order) });
            })
            .catch(err => {
                return next(err);
            })
    },

    getDetail(req, res, next) {
        Order.getDetail(req.params.id, false, function (err, result) {
            if (err) return next(err);

            return res.send(result);
        })
    },

    getStats(req, res, next) {
        var totalCount = 0;
        var totalSum = 0;
        var workTypes = [];
        var orderTypes = [];
        console.log(JSON.stringify(req.body));
        Order.getStats(req.body.from, req.body.to, function (err, orders) {
            if (err) return next(err);
            else {
                /*OrderType.find({}, function (err, orderTypes) {
                    if (err) return next(err);
                    WorkType.find({}, function (err, workTypes) {
                        if (err) return next(err);

                    })
                })*/
                console.log('stats', orders[0]);
                totalCount = orders.length;
                orders.forEach(function (detail) {
                    var order = detail.order;
                    console.log(detail.workType, detail.orderType);
                    totalSum += order.price ? order.price : 0;
                    if (detail.workType) workTypes.push(detail.workType);
                    if (detail.orderType) orderTypes.push(detail.orderType);
                })
                var groupWork = workTypes.reduce(function (rv, x) {
                    (rv[x["name"]] = rv[x["name"]] || []).push(x);
                    return rv;
                }, {});
                var groupOrder = orderTypes.reduce(function (rv, x) {
                    (rv[x["name"]] = rv[x["name"]] || []).push(x);
                    return rv;
                }, {});
                var workSum = {};
                var orderSum = {};
                for (var key in groupWork) {
                    if (groupWork.hasOwnProperty(key)) {
                        orders.forEach(function (order) {
                            if (order.workType && order.workType.name == key && order.order.price) {
                                //console.log("work", key);
                                if (!workSum[order.workType.name]) {
                                    workSum[order.workType.name] = {};
                                    workSum[order.workType.name].sum = 0;
                                    workSum[order.workType.name].count = 0;
                                    workSum[order.workType.name].time = 0;
                                }
                                workSum[order.workType.name].sum += order.order.price;
                                workSum[order.workType.name].count += 1;

                                if (order.order.startDate && order.order.endDate) {
                                    var start = moment.utc(order.order.startDate);
                                    var end = moment.utc(order.order.endDate);

                                    workSum[order.workType.name].time += end.diff(start);

                                    //console.log("start", moment(workingTime).utc().format('H'), moment(workingTime).utc().format('m'), order.order.description);
                                }
                            }
                        })
                    }
                }
                for (var key in groupOrder) {
                    if (groupOrder.hasOwnProperty(key)) {
                        orders.forEach(function (order) {
                            if (order.orderType && order.orderType.name == key && order.order.price) {
                                //console.log("order", order.order.description);
                                if (!orderSum[order.orderType.name]) {
                                    orderSum[order.orderType.name] = {};
                                    orderSum[order.orderType.name].sum = 0;
                                    orderSum[order.orderType.name].count = 0;
                                    orderSum[order.orderType.name].time = 0;
                                }
                                orderSum[order.orderType.name].sum += order.order.price;
                                orderSum[order.orderType.name].count += 1;

                                if (order.order.startDate && order.order.endDate) {
                                    var start = moment.utc(order.order.startDate);
                                    var end = moment.utc(order.order.endDate);

                                    orderSum[order.orderType.name].time += end.diff(start);

                                    //console.log("start", moment(workingTime).utc().format('H'), moment(workingTime).utc().format('m'), order.order.description);
                                }
                            }
                        })
                    }
                }
                //console.log(workSum);
                res.send({
                    totalCount: totalCount,
                    totalSum: totalSum,
                    orders: orders,
                    workSum: workSum,
                    orderSum: orderSum
                })
                // res.send(orders);
            }
        })
    }
};