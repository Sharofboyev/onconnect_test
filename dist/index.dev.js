"use strict";

var express = require("express");

var app = express();

var config = require("./config");

var body_parser = require("body-parser");

app.use(body_parser.json());

var user = require("./routers/index");

app.use("/", user);
app.use(function (req, res) {
  res.status(404).send("Not found");
});
app.use(function (error, req, res, next) {
  res.status(400).send(error.message);
});
app.listen(config.port, function () {
  console.log("Listening on port ".concat(config.port, "..."));
});