"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("../models/users"),
    UsersModel = _require.UsersModel;

var config = require("../config");

var bcrypt = require("bcrypt");

var Joi = require("joi");

var jwt = require("jsonwebtoken");

var UserService =
/*#__PURE__*/
function () {
  /**
   * @description Create an instance of UserService to implement all logic with user
   */
  function UserService() {
    _classCallCheck(this, UserService);

    this.user_model = new UsersModel(config.db);
  }
  /**
   * @description Hashes user password and adds user to database
   * @param {Object} user - User object, requires main properties of user
   * @param {String} user.userName - Username of user, min length 4, max length 32, must be unique, otherwise 409 status code generated
   * @param {String} user.password - Password of user, min length 8, max length 32. Should contain at least one number and one letter, otherwise 401 status code generated
   * @returns {Promise <{success: Boolean, status: Number} | {success: Boolean, status: Number, error: String}>} Return object defining status and success of request, status code can be 200, 400, 409, 500
   */


  _createClass(UserService, [{
    key: "create",
    value: function create(user) {
      var _Joi$object$validate, error, value, hash, _ref, success, status;

      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _Joi$object$validate = Joi.object({
                userName: Joi.string().min(4).max(32).required(),
                password: Joi.string().min(8).max(32).regex(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/).required()
              }).validate(user), error = _Joi$object$validate.error, value = _Joi$object$validate.value;

              if (!error) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", {
                success: false,
                status: 400,
                error: error.details[0].message
              });

            case 3:
              hash = bcrypt.hashSync(user.password, config.saltRounds);
              _context.next = 6;
              return regeneratorRuntime.awrap(this.user_model.add({
                userName: user.userName,
                password: hash
              }));

            case 6:
              _ref = _context.sent;
              success = _ref.success;
              status = _ref.status;
              return _context.abrupt("return", {
                success: success,
                status: status,
                error: status == 500 ? "Internal server error" : undefined
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
    /**
     * @description Compares inserted password and hashed password from database to authenticate user
     * @param {String} userName - Username of user, min length 4, max length 32
     * @param {String} password - Password of user, min length 8, max length 32
     * @returns {Promise <{success: Boolean, status: Number, error: String} | {success: Boolean, status: Number, token: String}>} Returns object with token property if password is correct, status code can be 200, 400, 401, 404, 500
     */

  }, {
    key: "auth",
    value: function auth(userName, password) {
      var error, user_data, token;
      return regeneratorRuntime.async(function auth$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              error = Joi.string().min(4).max(32).required().validate(userName).error;

              if (!error) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt("return", {
                success: false,
                status: 400,
                error: error.details[0].message
              });

            case 5:
              error = Joi.string().min(8).max(32).required().validate(password).error;

              if (!error) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", {
                success: false,
                status: 400,
                error: error.details[0].message
              });

            case 8:
              _context2.next = 10;
              return regeneratorRuntime.awrap(this.user_model.getUserData(userName));

            case 10:
              user_data = _context2.sent;

              if (!(user_data === null)) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", {
                success: false,
                status: 500
              });

            case 15:
              if (!(user_data === undefined)) {
                _context2.next = 17;
                break;
              }

              return _context2.abrupt("return", {
                success: false,
                status: 404
              });

            case 17:
              if (!bcrypt.compareSync(password, user_data.password)) {
                _context2.next = 22;
                break;
              }

              user_data.userName = userName;
              delete user_data.password;
              token = jwt.sign(user_data, config.privateKey, {
                expiresIn: config.expiration
              });
              return _context2.abrupt("return", {
                success: true,
                status: 200,
                token: token
              });

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return UserService;
}();

var MessengerService =
/*#__PURE__*/
function () {
  /**
   * @description Create an instance of UserService to implement all logic with user
   */
  function MessengerService() {
    _classCallCheck(this, MessengerService);
  }
  /**
   * @description Verifies token provided by user
   * @param {String} token JSON web token to verify user is authenticated 
   * @returns {Promise <Object | null>} Returns null if token is invalid, decoded user data if valid token provided
   */


  _createClass(MessengerService, [{
    key: "auth",
    value: function auth(token) {
      try {
        return jwt.verify(token, config.privateKey);
      } catch (error) {
        return null;
      }
    }
  }]);

  return MessengerService;
}();

module.exports.UserService = UserService;
module.exports.MessengerService = MessengerService;