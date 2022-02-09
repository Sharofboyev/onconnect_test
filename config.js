require("dotenv").config();

module.exports = {
    port: Number(process.env.APPLICATION_PORT),
    db: {
        port: Number (process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    saltRounds: Number(process.env.SALT_ROUNDS),
    privateKey: process.env.PRIVATE_KEY,
    expiration: Number(process.env.EXP_SEC)
}