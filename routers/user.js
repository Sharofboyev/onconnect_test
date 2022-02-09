const router = require("express").Router();
const {authenticate, createUser} = require("../controllers/user");

router.post("/add", (req, res) => {
    createUser(req, res);
})

router.post("/auth", (req, res) => {
    authenticate(req, res);
})

module.exports = router;