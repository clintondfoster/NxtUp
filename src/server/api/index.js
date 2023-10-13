const express = require("express");
const router = express.Router();

router.use("/groups", require("./groups"));
router.use("/questions", require("./questions"));
// router.use("/auth", require("./auth"));
// router.use("/users", require("./users"));
router.use("/role", require("./role"));


module.exports = router;
