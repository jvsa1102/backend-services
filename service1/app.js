require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var orderRouter = require('./routes/orderproducts');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

const jwt_authenticate = require('./middlewares/jwt_authenticate');
const user_authorize = require('./middlewares/user_authorize');
const setOrder = require('./middlewares/setOrder');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', jwt_authenticate, user_authorize, ordersRouter);
app.use('/order', jwt_authenticate, setOrder, orderRouter);

module.exports = app;
