var jwt = require('jsonwebtoken');
var md5 = require('md5');
var User = require('../models/User');

var userNames = [
    "b3e23950ce9db836be58984b72a87d6f",
    "dafd7ac512a735d64df89eef39fc0f8e"
]

module.exports = {

    register(req, res, next) {
    
        if (req.body.email &&
            req.body.password &&
            req.body.passwordConf) {

            var valid = false;

            userNames.forEach(function (name) {

                var hash = md5(req.body.email);

                console.log(hash);

                if (hash === name) valid = true;

            })

            if (!valid) {

                var error = new Error("Not valid email");
                error.status = 402;

                return res.status(402).send(error);
            }

            if (req.body.password.length < 6) {

                var error = new Error("Password has less then 6 characters.");
                error.status = 403;

                return res.status(402).send(error);

            }

            if (req.body.password !== req.body.passwordConf) {
                var error = new Error('Passwords do not match.');
                error.status = 400;
                //res.send("passwords dont match");
                return res.status(400).send(error);

            }
    
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
    },

    login(req, res,  next) {
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function (error, user) {
                if (error || !user) {
                    var err = new Error('Zlý email alebo heslo.');
                    err.status = 401;
                    return res.status(401).send(err);
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

}