var mongoose = require('mongoose');

var async = require('async');

var OrderSchema = new mongoose.Schema({

    description: {
        type: String
    },
    photoUrl: {
        type: String
    },
    photoUrls: {
        type: [{
            tag: String,
            url: String
        }]
    },
    workType: {
        type: mongoose.Schema.Types.ObjectId
    },
    orderType: {
        type: mongoose.Schema.Types.ObjectId
    },
    facilitiesArray: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    price: {
        type: Number
    },
    state: {
        type: String
    },
    arriveDate: {
        type: Date
    },
    pickDate: {
        type: Date,
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    facilities: {
        type: String
    },
    notes: {
        type: String
    },
    contact: {
        email: {
            type: String
        },
        phone: {
            type: String
        },
        customerName: {
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
    },
    sale: {
        type: Boolean,
        default: false
    },
    orderedDate: {
        type: Date
    },
    obtainedDate: {
        type: Date
    },
    leavedDate: {
        type: Date
    }
});

OrderSchema.statics.getFormData = function (callback) {

    function customerNames(result, callback) {
        mongoose.model('Customer').find({}, function (err, customers) {
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
        mongoose.model('WorkType').find({}, function (err, worktypes) {
            if (err) {
                callback(err, null);
            } else {
                result["worktypes"] = worktypes;
                callback(null, result);
            }
        })
    }

    function orderTypes(result, callback) {
        mongoose.model('OrderType').find({}, function (err, ordertypes) {
            if (err) {
                callback(err, null);
            } else {
                result["ordertypes"] = ordertypes;
                callback(null, result);
            }
        })
    }

    function facilities(result, callback) {
        mongoose.model('Facility').find({}, function (err, facilities) {
            if (err) {
                callback(err, null);
            } else {
                result["facilities"] = facilities;
                callback(null, result);
            }
        })
    }

    var prepareData = async.compose(orderTypes, workTypes, customerNames, facilities);
    prepareData({}, function (err, result) {
        callback(err, result);
    })
}

OrderSchema.statics.getDetail = function (id, skipCustomers, callback) {

    function getCustomers(result, callback) {
        mongoose.model('Customer').find({}, function (err, customers) {
            if (err) {
                callback(err, null);
            } else {
                result["customers"] = customers;
                //result.push({customers: customers});
                callback(null, result);
            }
        })
    }

    function getCustomer(result, callback) {
        if (!result.customerId) {
            result["customer"] = null;
            return callback(null, result);
        }
        mongoose.model('Customer').findOne({ _id: result.customerId }, function (err, customer) {
            if (err) {
                callback(err, null);
            } else {
                result["customer"] = customer;
                callback(null, result);
            }
        })
    }

    function getWorkType(result, callback) {
        if (!result.workType) {
            result["workType"] = null;
            return callback(null, result);
        }
        mongoose.model('WorkType').findOne({ _id: result.workType }, function (err, workType) {
            if (err) {
                callback(err, null);
            } else {
                result["workType"] = workType;
                callback(null, result);
            }
        })
    }

    function getOrderType(result, callback) {
        if (!result.orderType) {
            result["orderType"] = null;
            return callback(null, result);
        }
        mongoose.model('OrderType').findOne({ _id: result.orderType }, function (err, orderType) {
            if (err) {
                callback(err, null);
            } else {
                result["orderType"] = orderType;
                callback(null, result);
            }
        })
    }

    function getFacilities(result, callback) {
        if (!result.facilities) {
            result["customerFacilities"] = [];
            return callback(null, result);
        }
        mongoose.model('Facility').find({ _id: { $in: result.facilities }}, function (err, facilities) {
            if (err) {
                callback(err, null);
            } else {
                result["customerFacilities"] = facilities;
                callback(null, result);
            }
        })

    }

    Order.findById(id, function (err, order) {
        if (err) {
            return callback(err);
        } else if (!order) {
            return callback(new Error("No order was found."));
        } else {

            var data = {};

            if (order.customerId) data.customerId = order.customerId;
            if (order.workType) data.workType = order.workType;
            if (order.orderType) data.orderType = order.orderType;
            if (order.facilitiesArray) data.facilities = order.facilitiesArray;

            var detail;

            if (!skipCustomers) detail = async.compose(getFacilities, getOrderType, getWorkType, getCustomers, getCustomer);
            else detail = async.compose(getFacilities, getOrderType, getWorkType, getCustomer);

            detail(data, function (err, result) {
                result["order"] = order;
                callback(err, result);
            })
        }
    })
}

OrderSchema.statics.getStats = function (from, to, callback) {

    var orderDetails = [];

    Order.find({}).where('state').equals('pickUp').where('sale').equals(false).where('pickDate').gte(from).lte(to).exec(function (err, orders) {
        async.each(orders, function (order, callback) {
            
            Order.getDetail(order._id, true, function (err, detail) {
                orderDetails.push(detail);
                if (err) callback(err);
                else callback();
            })
        }, function (err) {
            callback(err, orderDetails);
        })
    });
}

OrderSchema.statics.byDateAndState = function (from, to, dateType, stateType, callback) {

    var orderDetails = [];

    if (stateType === 'all') {
        Order.find({ "state": { $ne: "pickUp" }}).where(dateType).gte(from).lte(to).exec(function (err, orders) {
            //console.log("collect orders", orders.length, 'from', from, 'to', to, 'dateType', dateType, 'stateType ' + stateType);
            callback(err, orders);
        });

    } else {
        Order.find({}).where("state").equals(stateType).where(dateType).gte(from).lte(to).exec(function (err, orders) {
            //console.log("collect orders", orders.length, 'from', from, 'to', to, 'dateType', dateType, 'stateType ' + stateType);
            callback(err, orders);
        });
    }
}

OrderSchema.statics.filterOrders = function (dateType, from, to, callback) {
    
}

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;