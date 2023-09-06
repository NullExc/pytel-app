
require('dotenv').config();

var https = require('https');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');

//loading api modules
var userApi = require('./server/api/userApi');
var customerApi = require('./server/api/customerApi');
var settingsApi = require('./server/api/settingsApi');
var orderApi = require('./server/api/orderApi');
var ordertypeApi = require('./server/api/ordertypeApi');
var worktypeApi = require('./server/api/worktypeApi');
var facilityApi = require('./server/api/facilityApi');
var userSettingsApi = require('./server/api/userSettingsApi');
var googleDriveApi = require('./server/google/googledrive');

//boot mongoose models
require('./server/models/Customer.js');
require('./server/models/Order.js');
require('./server/models/OrderType.js');
require('./server/models/User.js');
require('./server/models/WorkType.js');
require('./server/models/Facility.js');

var config = require('./config/config.js');

var app = express();
var isLoggedIn = false;

console.log("Connecting to DB", mongoose.version);

mongoose.connect(config.url, {

  useNewUrlParser: true
});

console.log("HOME UNIX", process.env.HOME);
console.log("PORT", process.env.PORT);

var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function(error) {
  console.error('Database connection error:', error);
});
db.once('open', function () {
  console.log('database connected!');
});

app.set('secret', 'pytel-app');
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/views'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
  res.locals = {
    isLoggedIn
  }
  
  next();
});

//user routes
app.post('/register', userApi.register);
app.post('/login', userApi.login);

app.get('/logout', function (req, res, next) {

  if (req.cookies && req.cookies.token) {
    res.clearCookie("token");

  }
  res.redirect('/');

})

app.use(function (req, res, next) {

  var token = req.body.token || req.query.token || req.headers['authorization'] || req.cookies.token;

  console.log("token ::: " + token);
  
  if (token) {

    jwt.verify(token, app.get('secret'), function (err, decoded) {

      if (err) {
        isLoggedIn = false;
        if (req.path === '/') return next();

        return res.redirect('/');

      } else {
        isLoggedIn = true;
        req.decoded = decoded;

        var now = Math.floor(Date.now() / 1000);
        var timeToExpire = (decoded.exp - now);

        if (timeToExpire < (60 * 180)) {
          var refreshToken = jwt.sign({ data: decoded.data }, req.app.get('secret'), {
            expiresIn: '1 day' //86400
          })

          res.cookie('token', refreshToken, {
            maxAge: 86400000, httpOnly: true
          })
        }

        if (req.path === '/') {
          return res.redirect('/order-new');
        } else {
          next();
        }
      }
    });
  } else {

    if (req.path === '/') {
      return next();
    }
    return res.redirect('/');
  }
});

app.get('/', function (req, res) {
  res.render('pages/index', { isLoggedIn: req.cookies.token ? true : false });
});

app.get('/ping', function (req, res) {
  res.send("This is a PING page");
});

//work type routes
app.get('/worktype', worktypeApi.getAll);
app.post('/worktype', worktypeApi.create);
app.post('/worktype/:id', worktypeApi.edit);
app.delete('/worktype/:id', worktypeApi.delete);

//order types routes
app.get('/ordertype/all', ordertypeApi.getAll);
app.post('/ordertype', ordertypeApi.create);
app.post('/ordertype/:id', ordertypeApi.edit);
app.delete('/ordertype/:id', ordertypeApi.delete);

//facility routes
app.get('/facility/all', facilityApi.getAll);
app.post('/facility', facilityApi.create);
app.post('/facility/:id', facilityApi.edit);
app.delete('/facility/:id', facilityApi.delete);

//order routes
app.get('/order-new', orderApi.new);
app.get('/order-edit/:id', orderApi.edit);
app.get('/order/all', orderApi.getAll);
app.get('/order/detail/:id', orderApi.getDetail);
app.get('/order/print/:id', orderApi.print);

app.post('/order', orderApi.create);
app.put('/order/:id', orderApi.update);
app.get('/order/:id', orderApi.get);
app.delete('/order/:id', orderApi.delete);

app.get('/calendar', orderApi.calendar);


//customer routes
app.get('/customer/all', customerApi.getAll);
app.get('/customer-search', customerApi.search);
app.get('/customer-new', customerApi.new);
app.get('/customer-edit/:id', customerApi.edit);
app.get('/customer/names', customerApi.getNames);
app.get('/customer/name/:name', customerApi.getByName);

app.post('/customer', customerApi.create);
app.get('/customer', customerApi.getAllData);
app.get('/customer/:id', customerApi.get);
app.put('/customer/:id', customerApi.update);
app.delete('/customer/:id', customerApi.delete);

app.post('/customer/sort', customerApi.sortByOrder);

app.get('/customer/profile/:id', customerApi.getProfile);
app.get('/customer/stats/:id', customerApi.stats);

//settings routes
app.get('/settings', settingsApi.get);
app.post('/user-settings', userSettingsApi.saveUserSettings);

app.get('/stats', function (req, res, next) {
  res.render('pages/stats', { isLoggedIn: req.cookies.token ? true : false });
})
app.post('/stats', orderApi.getStats);
app.post('/order/date', orderApi.getByDate);

app.use(function (req, res, next) {
  res.render('pages/not-found', { isLoggedIn: req.cookies.token ? true : false, status: 404, url: req.url });
});

app.use(function (err, req, res, next) {
  if (err) {
    console.info('error handler', err);
  }
  res.status(500).render('pages/error', { isLoggedIn: req.cookies.token ? true : false, error: err });
})


/*require('letsencrypt-express').create({
 
  server: 'staging'
 
, agreeTos: true
 
, approveDomains: [ 'localhost' ]
 
, app: app
 
}).listen(80, 5000);*/

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));

  console.log('env', process.env.HOMEPATH);
});
