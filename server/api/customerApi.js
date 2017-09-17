var Customer = require('../models/Customer');

module.exports.create = function (req, res, next) {

    console.log('creating user ....');

    if (!req.body.name) {
        var err = new Error('Meno je povinný údaj pre vytvorenie zákazníka.');
        err.status = 400;
        res.send('Meno je povinný údaj pre vytvorenie zákazníka.');
        return next(err);
    }

    var customerData = { name: req.body.name };

    if (req.body.contact) {
        customerData.contact = req.body.contact;
    }

    if (req.body.address) {
        customerData.address = req.body.address;
    }

    Customer.create(customerData, function (err, customer) {
        if (err) {
            return next(err);
        }
        return res.json({ message: 'customer created' });
    });
}

module.exports.getAll = function (req, res, next) {
    Customer.find({}, function (err, customers) {
        if (err) {
            return next(err);
        }
        return res.render('pages/customer/customers', { customers: customers });
    })
}

module.exports.get = function (req, res, next) {
    Customer.findById(req.params.id, function (err, customer) {
        if (err) {
            return next(err);
        }
        return res.render('pages/customer/customer',{ customer: customer });
    })
}

module.exports.getNames = function (req, res, next) {
    Customer.find({}, function (err, customers) {
        if (err) {
            return next(err);
        }
        var names = [];
        for (var i = 0; i < customers.length; i++) {
            names.push(customers[i].name);
        }
        return res.json({names: names});
    })
}

module.exports.update = function (req, res, next) {

    Customer.findById(req.params.id, function (err, customer) {
        if (err) {
            return next(err);
        }
        if (!customer) {
            return res.status(404).json({
                message: 'not found'
            })
        }
        customer.update(req.body, function (err, updated) {
            if (err) {
                return next(err);
            }
            return res.json(customer);
        })

    })
}

module.exports.delete = function (req, res, next) {
    Customer.remove({ _id: req.params.id }, function (err) {
        if (err) {
            return next(err);
        }
        return res.json({ message: 'customer deleted' });
    })
}

module.exports.search = function (req, res, next) {
    res.render('pages/customer/customer-search');
}

module.exports.new = function (req, res, next) {
    res.render('pages/customer/customer-new');
}