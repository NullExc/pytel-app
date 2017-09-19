var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    
    workType: {
        type: mongoose.Schema.Types.ObjectId
    },
    orderType: {
        type: String
    },
    price: {
        type: Number
    },
    state: {
        type: String
    },
    pickDate: {
        type: Date
    },
    contact: {
        email: {
            type: String
        },
        phone: {
            type: String
        }
    },
    facilities: [{
        type: String
    }],
    address: {
        type: String
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;