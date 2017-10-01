var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

//loading api modules
var userApi = require('./server/api/userApi');
var customerApi = require('./server/api/customerApi');
var settingsApi = require('./server/api/settingsApi');
var orderApi = require('./server/api/orderApi');
var worktypeApi = require('./server/api/worktypeApi');

//boot mongoose models
require('./server/models/Customer.js');
require('./server/models/Order.js');
require('./server/models/OrderType.js');
require('./server/models/User.js');
require('./server/models/WorkType.js');

var config = require('./config/config.js');

var app = express();

mongoose.connect(config.url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('database connected!');
});

app.set('secret', config.secret);
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});

//work type routes
app.get('/worktype', worktypeApi.getAll);
app.post('/worktype', worktypeApi.create);

//order routes
app.get('/order-new', orderApi.new);
app.get('/order/all', orderApi.getAll);
app.get('/order/detail/:id', orderApi.getDetail);

app.post('/order', orderApi.create);
app.get('/order/:id', orderApi.get);

app.get('/calendar', orderApi.calendar);


//customer routes
app.get('/customer/all', customerApi.getAll);
app.get('/customer-search', customerApi.search);
app.get('/customer-new', customerApi.new);
app.get('/customer-edit/:id', customerApi.edit);
app.get('/customer/names', customerApi.getNames);

app.post('/customer', customerApi.create);
app.get('/customer/:id', customerApi.get);
app.put('/customer/:id', customerApi.update);
app.delete('/customer/:id', customerApi.delete);

app.get('/customer/profile/:id', customerApi.getProfile);

//settings routes
app.get('/settings', settingsApi.get);

//user routes
app.post('/register', userApi.register);
app.post('/login', userApi.login);

app.use(function(req, res, next){
  res.render('pages/not-found', { status: 404, url: req.url });
});

app.use(function (err, req, res, next) {
  if (err) {
    console.info(err);
  }
  res.status(500).render('pages/error', {error : err});
})

/*app.use(function (req, res, next) {

  var token = req.body.token || req.query.token || req.headers['Authorization'];

  if (token) {

    jwt.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {

    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});*/




app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));

  console.log('env', process.env.HOMEPATH);
});
