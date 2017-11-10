var OrderType = require('../models/OrderType');

module.exports = {
    
create(req, res) {
    var orderType = req.body.ordertype;

    OrderType.create(orderType)
        .then(orderType => {
            return res.send({message: 'work type created'});
        }) 
        .catch(err => {
            return next(err);
        })
},

get(req, res) {
    OrderType.findById(req.params.id)
        .then(orderType => {
            return res.send({orderType: orderType});
        })
        .catch(err => {
            return next(err);
        })
},

getAll(req, res) {    
    OrderType.find({})
        .then(orderTypes => {
            return res.send({orderTypes: orderTypes});
        })
        .catch(err => {
            return next(err);
        })
}
}