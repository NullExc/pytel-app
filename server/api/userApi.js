var jwt = require('jsonwebtoken');
var User = require('../models/User');

module.exports.register = function (req, res, next) {

    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = { 
            email: req.body.email,
            password: req.body.password
        }

        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                return res.json({message: 'user created'});
            }
        });
    }
}

module.exports.login = function (req, res,  next) {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Zlý email alebo heslo.');
                err.status = 401;
                return next(err);
            } else {
                var token = jwt.sign({data: user}, req.app.get('secret'), {
                    expiresIn: 1440
                })

                console.log(token);

                res.cookie('token', token, {
                    maxAge: 86400000, httpOnly: true

                  }).json({
                    success: true,
                    token: token
                })

            }
        });
    }
}