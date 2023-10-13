const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const allRoles = await prisma.Role.findMany();
    res.send(allRoles);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
