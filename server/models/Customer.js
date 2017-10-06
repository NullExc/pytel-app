var mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    contact: {
        phone: String,
        email: String
    },
    address: {
        street: String,
        streetNumber: String,
        city: String,
        zipCode: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    billData: {
        ICO: {
            type: String
        },
        ICDPH: {
            type: String
        },
        DIC: {
            type: String
        }
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

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;