require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./models/connection');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipesRouter = require('./routes/recipes');
var ingredientsRouter = require('./routes/ingredients');
var menusRouter = require('./routes/menus');
var shopRouter = require('./routes/shop');
var adminRouter = require('./routes/admin');

const fileUpload = require('express-fileupload');
var app = express();

app.use(fileUpload());

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/menus', menusRouter);
app.use('/shop', shopRouter);
app.use('/admin', adminRouter);

module.exports = app;
