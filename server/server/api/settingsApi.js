var OrderType = require('../models/OrderType.js');
var WorkType = require('../models/WorkType');
var Facility = require('../models/Facility');

module.exports.get = function (req, res, next) {

    var settings = {};

    OrderType.find({}, function (err, orderTypes) {

        if (err) return next(err);

        settings.orderTypes = orderTypes;

        WorkType.find({}, function (err, workTypes) {

            if (err) return next(err);

            settings.workTypes = workTypes;

            Facility.find({}, function (err, facilities) {

                if (err) return next(err);

                settings.facilities = facilities;

                res.render('pages/settings/settings', { settings: settings });
            })
        })
    })
}