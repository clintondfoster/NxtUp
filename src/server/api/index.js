const express = require("express");
const router = express.Router();

router.use("/groups", require("./groups"));
router.use("/questions", require("./questions"));


module.exports = router;
