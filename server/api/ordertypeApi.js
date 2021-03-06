var OrderType = require('../models/OrderType');

module.exports = {

    create(req, res, next) {
        var orderType = req.body;

        console.log(orderType);

        OrderType.create(orderType)
            .then(orderType => {
                return res.send(orderType);
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
            res.send({ orderType: orderType });
        })
    },

    getAll(req, res, next) {
        OrderType.find({}, function (err, orderTypes) {
            if (err) {
                return next(err);
            }
            res.send({ orderTypes: orderTypes });
            return res.render('pages/settings/settings', { orderTypes: orderTypes });
        })
    },

    edit(req, res, next) {
        OrderType.update({ _id: req.params.id }, { name: req.body.name }, { multi: false, upsert: false })
            .then(orderType => {
                res.status(200).send({ message: 'Order Type updated successfully to ' + req.body.name });
            })
            .catch(err => {
                return next(err);
            })
    },

    delete(req, res, next) {

        OrderType.remove({ _id: req.params.id })
            .then(removed => {
                return res.json({ message: 'order type deleted' });
            })
            .catch(err => {
                return next(err);
            })
    }
}