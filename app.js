const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const methodOverride = require("method-override");
const multer = require('multer');
const GridStorage = require('multer-gridfs-storage');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


require('./api/models/db');

const corsOptions = {
	origin: true,
	credentials: true
};

const indexAPIRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/users');

const app = express();

app.use(methodOverride("_method"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/api/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
	res.statusJson = (statusCode, data)=>{
		let obj = {
			...data,
			statusCode: statusCode
		}
		res.status(statusCode).json(obj);
		return;
	}
	next();
});

app.options('*', cors(corsOptions));

app.use((req, res, next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	next();
});


app.use('/api', indexAPIRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
