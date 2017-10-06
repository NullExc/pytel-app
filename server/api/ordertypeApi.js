var OrderType = require('../models/OrderType');

module.exports.create = function (req, res, next) {

    var orderType = req.body.ordertype;

    OrderType.create( orderType, function (err, orderType) {
        if (err) {
            return next(err);
        }
        res.send({message: 'work type created'});
    })
}

module.exports.get = function (req, res, next) {
    OrderType.findById(req.params.id, function (err, orderType) {
        if (err) {
            return next(err);
        }
        res.send({orderType: orderType});
    })
}

module.exports.getAll = function (req, res, next) {
    
    OrderType.find( {}, function (err, orderTypes) {
        if (err) {
            return next(err);
        }
        res.send({orderTypes: orderTypes});
    })
}