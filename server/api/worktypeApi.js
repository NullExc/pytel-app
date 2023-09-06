var WorkType = require('../models/WorkType');

module.exports = {

    create(req, res, next) {
        var workType = req.body;

        console.log(workType);

        WorkType.create(workType, function (err, workType) {
            if (err) {
                return next(err);
            }
            res.send(200, workType);
        })
    },

    get(req, res, next) {
        WorkType.findById(req.params.id, function (err, workType) {
            if (err) {
                return next(err);
            }
            res.send({ workType: workType });
        })
    },

    getAll(req, res, next) {

        WorkType.find({}, function (err, workTypes) {
            if (err) {
                return next(err);
            }
            //res.send({workTypes: workTypes});
            return res.render('pages/settings/settings', { workTypes: workTypes });
        })
    },

    /**
       * @api {post} /worktype/:id Edit worktype
       * @apiName edit
       * @apiGroup WorkType
       * @apiVersion 0.1.0
       * @apiPermission admin
       * @apiSampleRequest /worktype/59d2af4f040f8f1efc5af296
       *
       * @apiSuccess {String} firstName First / given name.
       * @apiSuccess {String} lastName  Last / family name.
       * @apiSuccess {String} email     E-mail address.
       * @apiSuccess {String} createdAt Date of registration.
       * @apiSuccess {String} updatedAt Last profile update.
       * @apiSuccess {String} id        User's identifier.
       *
       * @apiSuccessExample Success 202 
       *     HTTP/1.1 202 Accepted
       *     {
       *        "message": "Work Type updated successfully"
       *     }
       */
    edit(req, res, next) {
        WorkType.update({ _id: req.params.id }, { name: req.body.name }, { multi: false, upsert: false })
            .then(workType => {
                res.status(202).send({ message: 'Work Type updated successfully to ' + req.body.name });
            })
            .catch(err => {
                return next(err);
            })
    },

    delete(req, res, next) {

        WorkType.remove({ _id: req.params.id })
            .then(removed => {
                return res.json({ message: 'work type deleted' });
            })
            .catch(err => {
                return next(err);
            })
    }
}