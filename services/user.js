const {UsersModel} = require("../models/users");
const config = require("../config");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

class UserService {
    /**
     * @description Create an instance of UserService to implement all logic with user
     */
    constructor (){
        this.user_model = new UsersModel(config.db)
    }

    /**
     * @description Hashes user password and adds user to database
     * @param {Object} user - User object, requires main properties of user
     * @param {String} user.userName - Username of user, min length 4, max length 32, must be unique, otherwise 409 status code generated
     * @param {String} user.password - Password of user, min length 8, max length 32. Should contain at least one number and one letter, otherwise 401 status code generated
     * @returns {Promise <{success: Boolean, status: Number} | {success: Boolean, status: Number, error: String}>} Return object defining status and success of request, status code can be 200, 400, 409, 500
     */
    async create (user){
        const {error, value} = Joi.object({
            userName: Joi.string().min(4).max(32).required(),
            password: Joi.string().min(8).max(32).regex(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/).required()
        }).validate(user);
        if (error) return {success: false, status: 400, error: error.details[0].message};
        const hash = bcrypt.hashSync(user.password, config.saltRounds);

        const {success, status} = await this.user_model.add({userName: user.userName, password: hash});
        return {success: success, status: status, error: status == 500 ? "Internal server error": undefined};
    }

    /**
     * @description Compares inserted password and hashed password from database to authenticate user
     * @param {String} userName - Username of user, min length 4, max length 32
     * @param {String} password - Password of user, min length 8, max length 32
     * @returns {Promise <{success: Boolean, status: Number, error: String} | {success: Boolean, status: Number, token: String}>} Returns object with token property if password is correct, status code can be 200, 400, 401, 404, 500
     */
    async auth (userName, password){
        let error = Joi.string().min(4).max(32).required().validate(userName).error
        if (error){
            return {success: false, status: 400, error: error.details[0].message};
        } 
        else {
            error = Joi.string().min(8).max(32).required().validate(password).error;
            if (error)
                return {success: false, status: 400, error: error.details[0].message};
        } 
        
        let user_data = await this.user_model.getUserData(userName);
        if (user_data === null) return {success: false, status: 500}
        else if (user_data === undefined) return {success: false, status: 404}

        if (bcrypt.compareSync(password, user_data.password)){
            user_data.userName = userName;
            delete(user_data.password);
            let token = jwt.sign(user_data, config.privateKey, {expiresIn: config.expiration});
            return {success: true, status: 200, token: token};
        }
    }
}

class MessengerService {
    /**
     * @description Create an instance of UserService to implement all logic with user
     */
    constructor (){
    }

    /**
     * @description Verifies token provided by user
     * @param {String} token JSON web token to verify user is authenticated 
     * @returns {Promise <Object | null>} Returns null if token is invalid, decoded user data if valid token provided
     */
    auth(token){
        try {
            return jwt.verify(token, config.privateKey)
        }
        catch (error) {
            return null;
        }
    }
}

module.exports.UserService = UserService
module.exports.MessengerService = MessengerService