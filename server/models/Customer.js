var mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        unique: false,
        required: false
    },
    email: {
        type: String,
        unique: false,
        required: false
    },
    street: {
        type: String,
        unique: false,
        required: false
    },
    zipCode: {
        type: Number,
        unique: false,
        required: false
    }
});

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;