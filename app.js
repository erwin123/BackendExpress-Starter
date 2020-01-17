var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// additional
var cors = require("cors");
var jwt = require("jsonwebtoken");
var whiteList = require("./entity/white-list-routes");
var allRequest = function(req, res, next) {
  let isWhiteList = false;
  whiteList.routes.find(wl => {
    if (wl == req.path) {
      isWhiteList = true;
    }
  });
  if (isWhiteList) {
    next();
  } else {
    jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY_JWT,
      function(err, decoded) {
        if (err) {
          res.status(401);
          res.end();
        } else {
          next();
        }
      }
    );
  }
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// additional
app.use(cors());
app.use(allRequest);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
