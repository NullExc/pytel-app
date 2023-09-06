var mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
    company: {
        name: {
            type: String,
        },
        address: {
            street: String,
            streetNumber: String,
            city: String,
            zipCode: String
        },
        contactPerson: {
            firstName: String,
            lastName: String,
            phone: String,
            email: String
        },
        billData: {
            ICO: String,
            ICDPH: String,
            DIC: String
        }
    },
    person: {
        firstName: {
            type: String,
            unique: false,
            trim: true
        },
        lastName: {
            type: String,
            unique: false,
            trim: true
        },
        phone: String,
        email: String,
        address: {
            street: String,
            streetNumber: String,
            city: String,
            zipCode: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    fullName: {
        type: String
    },
    search: {
        type: String
    }
});

CustomerSchema.statics.getProfile = function (id, callback) {
    Customer.findById( id, function (err, customer) {
        if (err) {
            return callback(err)
        } else if (!customer) {
            var err = new Error('Customer not found.');
            err.status = 401;
            return callback(err);
        }
        mongoose.model('Order').find( { customerId: customer._id }, function (err, orders) {
            if (err) {
                return callback(err);
            }
            if (orders.length > 0) {
                return callback(null, {customer: customer, orders: orders});
            } else {
                return callback();
            }
        })
    })
}

CustomerSchema.statics.getStats = function (id, callback) {


    Customer.findById(id, function (err, customer) {
        if (err) return callback(err);
        if (customer) {
            mongoose.model('Order').find({ customerId: id}).where("state").equals('pickUp').exec(function (err, orders) {
                if (err) return callback(err);
                callback(null, { customer: customer, orders: orders });
            })
        } else {
            callback();
        }
    })
}

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;