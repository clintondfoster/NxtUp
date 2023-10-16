const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

router.get("/", async (req, res, next) => {
  try {
    const allRoles = await prisma.Role.findMany();
    res.send(allRoles);
  } catch (err) {
    next(err);
  }
});

router.post("/", protection, async (req, res, next) => {
  try {
    const { accessCode } = req.body;
    const userId = req.user.id
    const group = await prisma.group.findFirst({
      where: {
        access_code: accessCode,
      },
    });
    const role = await prisma.Role.create({
      data: {
        user_id: userId,
        group_id: group.id,
        is_admitted: true,
        is_creator: false,
      },
    });
    res.send(role);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
