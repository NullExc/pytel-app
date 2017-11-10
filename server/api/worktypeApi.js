var WorkType = require('../models/WorkType');

module.exports = {

create(req, res, next) {

    var workType = req.body.worktype;

    console.log(workType);

    WorkType.create( workType, function (err, workType) {
        if (err) {
            return next(err);
        }
        res.send({message: 'work type created'});
    })
},

get(req, res, next) {
    WorkType.findById(req.params.id, function (err, workType) {
        if (err) {
            return next(err);
        }
        res.send({workType: workType});
    })
},

getAll (req, res, next) {
    
    WorkType.find( {}, function (err, workTypes) {
        if (err) {
            return next(err);
        }
        res.send({workTypes: workTypes});
    })
},

// edit(req, res) {
//     WorkType.update({})
//         .then()
//         .catch()
// }
}