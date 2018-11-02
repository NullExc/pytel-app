var Facility = require('../models/Facility');

module.exports = {

    create(req, res, next) {

        var facility = req.body;

        Facility.create(facility)
            .then(facility => {
                return res.send(facility);
            })
            .catch(err => {
                return next(err);
            })
    },

    get(req, res, next) {
        Facility.findById(req.params.id, function (err, facility) {
            if (err) {
                return next(err);
            }
            res.send({ facility: facility });
        })
    },

    getAll(req, res, next) {
        Facility.find({}, function (err, facility) {
            if (err) {
                return next(err);
            }
            res.send({ facility: facility });
            return res.render('pages/settings/settings', { facility: facility });
        })
    },

    edit(req, res, next) {
        Facility.update({ _id: req.params.id }, { name: req.body.name }, { multi: false, upsert: false })
            .then(orderType => {
                res.status(200).send({ message: 'Facility updated successfully to ' + req.body.name });
            })
            .catch(err => {
                return next(err);
            })
    },

    delete(req, res, next) {

        Facility.remove({ _id: req.params.id })
            .then(removed => {
                return res.json({ message: 'Facility deleted' });
            })
            .catch(err => {
                return next(err);
            })
    }
}