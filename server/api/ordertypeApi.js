var OrderType = require('../models/OrderType');

module.exports = {
    
create(req, res, next) {
    var orderType = req.body.ordertype;

    OrderType.create(orderType)
        .then(orderType => {
            return res.send({message: 'work type created'});
        }) 
        .catch(err => {
            return next(err);
        })
},

get(req, res, next) {
    OrderType.findById(req.params.id, function (err, orderType) {
        if (err) {
            return next(err);
        }
        res.send({orderType: orderType});
    })
},

getAll(req, res, next) {    
    OrderType.find( {}, function (err, orderTypes) {
        if (err) {
            return next(err);
        }
        res.send({orderTypes: orderTypes});
    })
},

edit(req, res, next) {
    OrderType.update({id: req.params.id}, {name: req.body.ordertype}, false, false)
        .then(workType => {
            res.send(200, {message: 'Work Type updated successfully'});
        })
        .catch(err => {
            return next(err);
        })
}
}