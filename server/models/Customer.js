var mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
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
    }
});

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;