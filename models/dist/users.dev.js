"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("pg"),
    Pool = _require.Pool;

var UsersModel =
/*#__PURE__*/
function () {
  /**
   * @description Create an instance of UsersModel to handle user data from database
   */
  function UsersModel(db) {
    _classCallCheck(this, UsersModel);

    this.pool = new Pool(db);
    this.pool.query("\n        CREATE TABLE IF NOT EXISTS public.users\n        (\n            id SERIAL PRIMARY KEY,\n            username character varying(32) NOT NULL,\n            password character varying(128) NOT NULL,\n            status character varying(16) DEFAULT 'user',\n            created_time timestamptz DEFAULT now(),\n            CONSTRAINT username UNIQUE (username)\n        )");
  }
  /**
   * @description Create new user in database
   * @param {Object} user - new user object
   * @param {string} user.userName - Username for new user, max length 256
   * @param {string} user.password - hashed password for new user, max length 1024
   * @returns {Promise <{success: boolean, status: number}>} status object for detecting success. Status codes: 200, 409, 500
   */


  _createClass(UsersModel, [{
    key: "add",
    value: function add(user) {
      return regeneratorRuntime.async(function add$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(this.pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [user.userName, user.password]));

            case 3:
              return _context.abrupt("return", {
                success: true,
                status: 200
              });

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);

              if (!(_context.t0.code == 23505)) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", {
                success: false,
                status: 409
              });

            case 10:
              return _context.abrupt("return", {
                success: false,
                status: 500
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 6]]);
    }
    /**
     * @description used to get password of user with given username (for checking authentication)
     * @param {String} username - Username of user
     * @returns {Promise <String | null | undefined>} Password of user with given username, undefined if user not exists, null if error occurs
     */

  }, {
    key: "getPassword",
    value: function getPassword(username) {
      var res;
      return regeneratorRuntime.async(function getPassword$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.pool.query("SELECT password FROM users WHERE username = $1", [username]));

            case 3:
              res = _context2.sent;

              if (!(res.rowCount === 0)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return", undefined);

            case 6:
              return _context2.abrupt("return", res.rows[0].password);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", null);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 9]]);
    }
  }]);

  return UsersModel;
}();

module.exports.UsersModel = UsersModel;