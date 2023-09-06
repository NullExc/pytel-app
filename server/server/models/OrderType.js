var mongoose = require('mongoose');
var async = require('async');

var OrderTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

OrderTypeSchema.statics.getFormData = function (callback) {
        
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
    
        var prepareData = async.compose(orderTypes);
        prepareData({}, function (err, result) {
            callback(err, result);
        })
    }
    
    OrderTypeSchema.statics.getDetail = function (id, callback) {
    
        function getOrderType(result, callback) {
            if (!result.orderType) {
                result["orderType"] = null;
                return callback(null, result);
            }
            mongoose.model('OrderType').findOne({_id: result.orderType}, function (err, orderType) {
                if (err) {
                    callback(err, null);
                } else {
                    result["orderType"] = order;
                    callback(null, result);
                }
            })
        }
    
        Order.findById(_id, function (err, orderType) {
            if (err) {
                return callback(err);
            } else if (!orderType) {
                return callback(new Error("No OrderType was found."));
            } else {
    
                var data = {};
    
                if (orderType.type) data.type = orderType.type;
    
                var detail = async.compose(getOrderType);
                detail(data, function (err, result) {
                    result["orderType"] = orderType;
                    callback(err, result);
                })
            }
        })
    }
    

var OrderType = mongoose.model('OrderType', OrderTypeSchema);

module.exports = OrderType;