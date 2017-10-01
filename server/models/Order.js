var mongoose = require('mongoose');

var async = require('async');

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

OrderSchema.statics.getFormData = function (callback) {

    function customerNames(result, callback) {
        mongoose.model('Customer').find( {}, function (err, customers) {
            if (err) {
                callback(err, null);
            } else {
                result["customers"] = customers;
                //result.push({customers: customers});
                callback(null, result);
            }
        })
    }

    function workTypes(result, callback) {
        mongoose.model('WorkType').find( {}, function (err, worktypes) {
            if (err) {
                callback(err, null);
            } else {
                result["worktypes"] = worktypes;
                callback(null, result);
            }
        })
    }

    function orderTypes(result, callback) {
        mongoose.model('OrderType').find( {}, function (err, ordertypes) {
            if (err) {
                callback(err, null);
            } else {
                result["ordertypes"] = ordertypes;
                callback(null, result);
            }
        })
    }

    var prepareData = async.compose(orderTypes, workTypes, customerNames);
    prepareData({}, function (err, result) {
        callback(err, result);
    })
}

OrderSchema.statics.getDetail = function (id, callback) {
    Order.findById(id, function (err, order) {
        if (err) {
            return callback(err);
        }
        if (order.customerId) {
            mongoose.model('Customer').findOne({_id: order.customerId}, function (err, customer) {
                if (err) {
                    return callback(err);
                }
                if (customer) {
                    return callback(err, {order: order, customer: customer});
                } else {
                    return callback(err, {order: order});
                }
            })
        } else {
            return callback(err, {order: order});
        }
    })
}

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;