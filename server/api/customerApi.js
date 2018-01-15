var Customer = require('../models/Customer');
var Order = require('../models/Order');

var async = require('async');

module.exports = {
    create(req, res, next) {

        console.log(JSON.stringify(req.body.customer, 2, 2));

        Customer.create(req.body.customer, function (err, customer) {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'customer created', id: customer._id });
        });
    },

    sortByOrder(req, res, next) {

        var customers = req.body.customers;

        var order = req.body.order;

        var result = [];

        async.each(customers, function (customer, callback) {
            Order.find({}).where('customerId').equals(customer._id).where('state').equals(order).exec(function (err, orders) {
                //console.log("customer " + customer.fullName + " has " + orders.length + " orders");
                if (orders && orders.length > 0) {
                    result.push(customer);
                }
                callback();
            })
        }, function (err) {
            res.send(result);
        })
    },

    getAll(req, res, next) {
        Customer.find({}, function (err, customers) {
            if (err) {
                return next(err);
            }

            res.render('pages/customer/customers', { customers: customers });
        })
    },
    get(req, res, next) {
        Customer.findById(req.params.id, function (err, customer) {
            var customerOrders = [];
            if (err) {
                return next(err);
            }
            Order.find({}).where('customerId').equals(req.params.id).exec(function (err, orders) {
                if (err) {
                    return next(err);
                }
                if (orders) customerOrders = orders;

                return res.render('pages/customer/customer', { customer: customer, orders: customerOrders });

            })
        })
    },
    getProfile(req, res, next) {

        Customer.getProfile(req.params.id, function (err, profile) {
            if (err) {
                return next(err);
            }
            res.send({ profile: profile });
        })
        //return res.render('pages/customer/customer',{ customer: customer });
    },
    getNames(req, res, next) {

        Customer.find({}, function (err, customers) {
            if (err) {
                return next(err);
            }
            var names = [];
            for (var i = 0; i < customers.length; i++) {
                names.push(customers[i].fullName);
            }
            return res.json({ names: names });
        })
    },
    getByName(req, res, next) {

        Customer.find({}, function (err, customers) {
            if (err) {
                return next(err);
            }

            var result;
            
            async.each(customers, function (customer, callback) {

                if (customer.fullName === req.params.name) {
                    result = customer;
                }

                callback();

            }, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json({customer: result});
            })
        })

    },
    update(req, res, next) {

        Customer.update({ _id: req.params.id }, req.body.customer, { multi: false, upsert: false })
            .then(customer => {
                res.status(200).send({ message: 'Customer updated successfully to ' + JSON.stringify(customer) });
            })
            .catch(err => {
                return next(err);
            })
    },
    delete(req, res, next) {

        Customer.remove({ _id: req.params.id })
            .then(removed => {
                return res.json({ message: 'customer deleted' });
            })
            .catch(err => {
                return next(err);
            })
    },
    search(req, res, next) {
        res.render('pages/customer/customer-search');
    },
    new(req, res, next) {
        res.render('pages/customer/customer-new');
    },
    edit(req, res, next) {

        Customer.findById(req.params.id)
            .then(customer => {
                if (!customer) {
                    return res.status(404).json({
                        message: 'not found'
                    })
                }
                res.render('pages/customer/customer-edit', { customer: customer });
            })
            .catch(err => {
                return next(err);
            })
    },

    stats(req, res, next) {

        Customer.getStats(req.params.id, function (err, result) {
            if (err) return next(err);
            res.send(result);
        })
    }
}