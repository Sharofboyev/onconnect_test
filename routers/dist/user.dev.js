"use strict";

var router = require("express").Router();

var _require = require("../controllers/user"),
    authenticate = _require.authenticate,
    createUser = _require.createUser;

router.post("/add", function (req, res) {
  createUser(req, res);
});
router.post("/auth", function (req, res) {
  authenticate(req, res);
});
module.exports = router;