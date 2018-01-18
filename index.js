

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
var googleDriveApi = require('./server/google/googledrive');

//boot mongoose models
require('./server/models/Customer.js');
require('./server/models/Order.js');
require('./server/models/OrderType.js');
require('./server/models/User.js');
require('./server/models/WorkType.js');

var config = require('./config/config.js');

var app = express();

mongoose.connect(config.url, {

  reconnectTries: 100,
  
  reconnectInterval: 10000
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('database connected!');
});

app.set('secret', config.secret);
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/views'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

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

  console.log('cookies', req.cookies.token);

  var token = req.body.token || req.query.token || req.headers['authorization'] || req.cookies.token;

  if (token) {

    jwt.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
      next(); //  return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;

        if (req.path === '/') {
          return res.redirect('/order-new');
        }
        next();
      }
    });

  } else {

    console.log('path', req.path);

    if (req.path === '/') {
      return next();
    }

    var error = new Error("Vaše sedenie na stránke vypršalo. <a href='/'>Prihláste sa prosím.</a>");

    error.status = 509;

    //console.log('no token', req.headers);

    /*return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });*/

    return next(error);

  }
});

app.get('/', function (req, res) {
  res.render('pages/index');
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

//order routes
app.get('/order-new', orderApi.new);
app.get('/order-edit/:id', orderApi.edit);
app.get('/order/all', orderApi.getAll);
app.get('/order/detail/:id', orderApi.getDetail);

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
app.get('/customer/:id', customerApi.get);
app.put('/customer/:id', customerApi.update);
app.delete('/customer/:id', customerApi.delete);

app.post('/customer/sort', customerApi.sortByOrder);

app.get('/customer/profile/:id', customerApi.getProfile);
app.get('/customer/stats/:id', customerApi.stats);

//settings routes
app.get('/settings', settingsApi.get);

app.get('/stats', function (req, res, next) {
  res.render('pages/stats');
})
app.post('/stats', orderApi.getStats);

app.use(function(req, res, next){
  res.render('pages/not-found', { status: 404, url: req.url });
});

app.use(function (err, req, res, next) {
  if (err) {
    console.info('error handler', err);
  }
  res.status(500).render('pages/error', {error : err});
})




app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));

  console.log('env', process.env.HOMEPATH);
});
