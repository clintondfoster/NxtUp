const express = require("express");
const router = express.Router();

router.use("/groups", require("./api/groups"));
router.use("/questions", require("./api/questions"));
router.use("/users", require("./api/users"));
router.use("/role", require("./api/role"));


module.exports = router;
