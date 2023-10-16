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

router.post("/", async (req, res, next) => {
  try {
    const { group_name } = req.body;
    const testUser = 1;
    const group = await prisma.group.findFirst({
      where: {
        name: group_name,
      },
    });
    const role = await prisma.Role.create({
      data: {
        user_id: testUser,
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
