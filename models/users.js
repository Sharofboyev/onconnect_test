const {Pool} = require("pg");

class UsersModel {
    /**
     * @description Create an instance of UsersModel to handle user data from database
     */
    constructor (db){
        this.pool = new Pool(db);
        this.pool.query(`
        CREATE TABLE IF NOT EXISTS public.users
        (
            id SERIAL PRIMARY KEY,
            username character varying(32) NOT NULL,
            password character varying(128) NOT NULL,
            status character varying(16) DEFAULT 'user',
            created_time timestamptz DEFAULT now(),
            CONSTRAINT username UNIQUE (username)
        )`)
    }

    /**
     * @description Create new user in database
     * @param {Object} user - new user object
     * @param {string} user.userName - Username for new user, max length 256
     * @param {string} user.password - hashed password for new user, max length 1024
     * @returns {Promise <{success: boolean, status: number}>} status object for detecting success. Status codes: 200, 409, 500
     */
    async add(user){
        try {
            await this.pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [user.userName, user.password]);
            return {success: true, status: 200}
        }
        catch (err){
            //if user already exists, err.code would be 23505 from Postgres
            if (err.code == 23505){
                return {success: false, status: 409}
            }
            return {success: false, status: 500}
        }
    }

    /**
     * @description used to get password of user with given username (for checking authentication)
     * @param {String} username - Username of user
     * @returns {Promise <String | null | undefined>} Password of user with given username, undefined if user not exists, null if error occurs
     */
    async getPassword(username){
        try {
            let res = await this.pool.query("SELECT password FROM users WHERE username = $1", [username]);
            if (res.rowCount === 0) return undefined;
            return res.rows[0].password
        }
        catch (err){
            return null
        }
    }
}

module.exports.UsersModel = UsersModel;