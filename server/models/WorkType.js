var mongoose = require('mongoose');
var async = require('async');

var WorkTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

WorkTypeSchema.statics.getFormData = function (callback) {
    
    function workTypes(result, callback) {
        mongoose.model('WorkType').find( {}, function (err, workTypes) {
            if (err) {
                callback(err, null);
            } else {
                result["workTypes"] = workTypes;
                callback(null, result);
            }
        })
    }

    var prepareData = async.compose(workTypes);
    prepareData({}, function (err, result) {
        callback(err, result);
    })
}

WorkTypeSchema.statics.getDetail = function (id, callback) {

    function getworkType(result, callback) {
        if (!result.workType) {
            result["workType"] = null;
            return callback(null, result);
        }
        mongoose.model('workType').findOne({_id: result.workType}, function (err, workType) {
            if (err) {
                callback(err, null);
            } else {
                result["workType"] = order;
                callback(null, result);
            }
        })
    }

    Order.findById(_id, function (err, workType) {
        if (err) {
            return callback(err);
        } else if (!workType) {
            return callback(new Error("No workType was found."));
        } else {

            var data = {};

            if (workType.type) data.type = workType.type;

            var detail = async.compose(getworkType);
            detail(data, function (err, result) {
                result["workType"] = workType;
                callback(err, result);
            })
        }
    })
}

var WorkType = mongoose.model('WorkType', WorkTypeSchema);

module.exports = WorkType;