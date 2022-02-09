"use strict";

var jwt = require("jsonwebtoken");

var config = require("../config");

module.exports = function (req, res, next) {
  if (req.headers.token) {
    jwt.verify(req.headers.token, config.privateKey, function (err, decoded) {
      if (err) return res.status(401).send("Unauthorized");
      ;
      req.user = decoded.data;
      next();
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};