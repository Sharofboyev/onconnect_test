"use strict";

var router = require("express").Router();

var user = require("./user");

router.use("/user", user);
module.exports = router;