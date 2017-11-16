var Customer = require('../models/Customer');
var Order = require('../models/Order');

module.exports = {
    create(req, res, next) {

        if (!req.body.firstName && !req.body.lastName) {
            var err = new Error('Meno je povinný údaj pre vytvorenie zákazníka.');
            err.status = 400;
            res.send('Meno je povinný údaj pre vytvorenie zákazníka.');
            return next(err);
        }

        var customerData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        if (req.body.contact) {
            customerData.contact = req.body.contact;
        }

        if (req.body.address) {
            customerData.address = req.body.address;
        }

        if (req.body.billData) {
            customerData.billData = req.body.billData;
        }

        Customer.create(customerData, function (err, customer) {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'customer created', id: customer._id });
        });
    },
    getAll(req, res, next) {
        Customer.find({}, function (err, customers) {
            if (err) {
                return next(err);
            }
            var sortOption = 0;
            var orderOption = 0;
            var callback = false;
            if (req.query) {
                if (req.query.sort) {
                    var sort = req.query.sort;

                    var temp = customers;
                    customers = [];
                    if (sort === "ascending") {
                        sortOption = 1;
                        customers = temp.sort(function (a, b) { return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0); });
                    } else if (sort === "descending") {
                        sortOption = 2;
                        customers = temp.sort(function (a, b) { return (a.lastName > b.lastName) ? -1 : ((b.lastName > a.lastName) ? 1 : 0); });
                    }
                }
                if (req.query.order) {
                    callback = true;
                    var order = req.query.order;
                    var temp = customers;
                    customers = [];
                    var query = Order.$where("this.state === '" + order + "'").then(orders => {
                        //console.log("query", JSON.stringify(orders));
                        orders.forEach(function (order) {
                            temp.forEach(function (customer) {
                                if (order.customerId.toString() == customer._id.toString()) {
                                    console.log("match", order.customerId, customer._id);
                                    customers.push(customer);
                                }
                            })
                        })
                        customers = customers.filter((customer, index, self) =>
                            index === self.findIndex((t) => (
                                t._id === customer._id
                            )
                            ))
                        //console.log("query", JSON.stringify(orders));
                        return res.render('pages/customer/customers', { customers: customers, sortOption: sortOption, orderOption: orderOption });
                    });
                }

                //console.log(req.query.sort);
            }
            if (req.query && req.query.order) {
                var order = req.query.order;
            }
            if (!callback) {
                return res.render('pages/customer/customers', { customers: customers, sortOption: sortOption, orderOption: orderOption });
            }
        })
    },
    get(req, res, next) {
        Customer.findById(req.params.id, function (err, customer) {
            if (err) {
                return next(err);
            }
            return res.render('pages/customer/customer', { customer: customer });
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
                names.push(customers[i].lastName);
            }
            return res.json({ names: names });
        })
    },
    update(req, res, next) {

        Customer.update({ _id: req.params.id }, req.body, { multi: false, upsert: false })
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
    }
}