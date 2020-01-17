var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/users");
var jwt = require("jsonwebtoken");
const Op = model.Sequelize.Op;

// User Guide
// https://sequelize.org/master/manual/querying.html
// https://expressjs.com/en/guide/routing.html

// POST
router.post("/", function(req, res, next) {
  model.sequelize
    .query(sql.spUserRegistration, {
      replacements: req.body,
      type: model.sequelize.QueryTypes.SELECT
    })
    .then(result => {
      if (result[0].success == 1) {
        response.ok("Add user success.", result[0], res);
      } else {
        res.status(500);
        response.error("Error while add user!", result[0].ErrorMessage, res);
      }
    })
    .catch(error => {
      res.status(500);
      response.error("Error while add user!", error, res);
    });
});

// LOGIN
router.post("/login", function(req, res, next) {
  let dataLogin = {
    profileUser: null,
    token: ""
  };
  model.sequelize
    .query(sql.spUserLogin, {
      replacements: req.body,
      type: model.sequelize.QueryTypes.SELECT
    })
    .then(result => {
      if (result[0].success == 1) {
        dataLogin.profileUser = result[0];
        dataLogin.token = jwt.sign(
          {
            data: req.body.userName
          },
          process.env.SECRET_KEY_JWT,
          {
            expiresIn: process.env.EXPIRED_TIME_JWT
          }
        );
        response.ok("Logic success.", dataLogin, res);
      } else {
        res.status(403);
        response.error(
          "Username atau password anda salah.",
          result[0].ErrorMessage,
          res
        );
      }
    })
    .catch(error => {
      res.status(500);
      response.error("Error while login user!", error, res);
    });
});

// GET User
router.get("/", function(req, res, next) {
  model.User.findAll()
    .then(result => {
      response.ok("List user.", result, res);
    })
    .catch(error => {
      res.status(500);
      response.error("Error while get list user!", error, res);
    });
});

// GET User by id
router.get("/:userId", function(req, res, next) {
  model.User.findAll({
    attributes: [
      "id",
      "userName",
      "fullName",
      "email",
      "noHp",
      "address",
      "isActive",
      "deleted"
    ],
    where: {
      id: req.params.userId
    }
  })
    .then(result => {
      response.ok("Get user by user id.", result, res);
    })
    .catch(error => {
      res.status(500);
      response.error("Error while get user by user id!", error, res);
    });
});

// Using query
router.get("/using/sql", function(req, res, next) {
  model.sequelize
    .query(sql.getUser, {
      type: model.sequelize.QueryTypes.SELECT
    })
    .then(result => {
      response.ok("List user.", result, res);
    })
    .catch(error => {
      res.status(500);
      response.error("Error while get list user!", error, res);
    });
});

module.exports = router;
