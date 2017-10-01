var WorkType = require('../models/WorkType');

module.exports.create = function (req, res, next) {

    var workType = req.body.workType;

    WorkType.create( workType, function (err, workType) {
        if (err) {
            return next(err);
        }
        res.send({message: 'work type created'});
    })
}

module.exports.get = function (req, res, next) {
    
}

module.exports.getAll = function (req, res, next) {
    
    WorkType.find( {}, function (err, workTypes) {
        if (err) {
            return next(err);
        }
        res.send({workTypes: workTypes});
    })
}