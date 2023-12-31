const express = require("express");
const router = express.Router();

router.use("/groups", require("./api/groups"));
router.use("/questions", require("./api/questions"));
router.use("/users", require("./api/users"));
router.use("/role", require("./api/role"));
router.use("/submissions", require("./api/submissions"))
router.use("/vote", require("./api/vote"));


module.exports = router;
