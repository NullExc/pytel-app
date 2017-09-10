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
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
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

module.exports.login = function (req, res, next) {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                var token = jwt.sign({data: user}, req.app.get('secret'), {
                    expiresIn: 1440
                })
                res.json({
                    success: true,
                    token: token
                })
            }
        });
    }
}