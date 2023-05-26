const { register, login } = require("../router/registerRouter");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;