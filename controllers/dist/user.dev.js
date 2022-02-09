"use strict";

var _require = require("../services/user"),
    UserService = _require.UserService;

var userServiceInstance = new UserService();
/**
 * @description Create a user with the provided body
 * @param req {object} Express req object 
 * @param res {object} Express res object
 * @returns {Promise<*>}
 */

function createUser(req, res) {
  var _ref, status, success, error;

  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(userServiceInstance.create(req.body));

        case 3:
          _ref = _context.sent;
          status = _ref.status;
          success = _ref.success;
          error = _ref.error;

          if (!error) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(status).send({
            success: false,
            error: error
          }));

        case 9:
          return _context.abrupt("return", res.status(status).send({
            success: success
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.message);
          res.status(500).send("Internal server error occured");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

function authenticate(req, res) {
  var _ref2, success, status, token;

  return regeneratorRuntime.async(function authenticate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(userServiceInstance.auth(req.body.userName, req.body.password));

        case 3:
          _ref2 = _context2.sent;
          success = _ref2.success;
          status = _ref2.status;
          token = _ref2.token;

          if (!(status == 400)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Username and password should be declared in request body."));

        case 9:
          return _context2.abrupt("return", res.status(status).header({
            token: token
          }).send({
            success: success
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.message);
          res.status(500).send("Internal server error occured");

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

module.exports = {
  createUser: createUser,
  authenticate: authenticate
};