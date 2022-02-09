const { UserService } = require("../services/user")
const userServiceInstance = new UserService();


/**
 * @description Create a user with the provided body
 * @param req {object} Express req object 
 * @param res {object} Express res object
 * @returns {Promise<*>}
 */
async function createUser (req, res) {
    try {
        const {status, success, error} = await userServiceInstance.create(req.body);
        if (error) return res.status(status).send({success: false, error: error})
        return res.status(status).send({success: success});
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error occured");
    }
}

/**
 * @description Return jwt token in the header of response if password is correct
 * @param req {object} Express req object 
 * @param res {object} Express res object
 * @returns {Promise<*>}
 */
async function authenticate (req, res) {
    try {
        const {success, status, token} = await userServiceInstance.auth(req.body.userName, req.body.password);
        if (status == 400) return res.status(400).send("Username and password should be declared in request body.");
        return res.status(status).header({token: token}).send({success: success});
    }
    catch (err){
        console.log(err.message)
        res.status(500).send("Internal server error occured")
    }
}

module.exports = { createUser, authenticate };