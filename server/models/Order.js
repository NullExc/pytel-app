var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    
    description: {
        type: String
    },
    workType: {
        type: mongoose.Schema.Types.ObjectId
    },
    orderType: {
        type: mongoose.Schema.Types.ObjectId
    },
    price: {
        type: Number
    },
    state: {
        type: String
    },
    arriveDate: {
        type: Date,
        default: Date.now
    },
    pickDate: {
        type: Date,
    },
    facilities: [{
        type: String
    }],
    contact: {
        email: {
            type: String
        },
        phone: {
            type: String
        }
    },
    address: {
        street: String,
        streetNumber: String,
        city: String,
        zipCode: String
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
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

OrderSchema.statics.getDetail = function (id, callback) {
    Order.findById(id, function (err, order) {
        
    })
}

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;