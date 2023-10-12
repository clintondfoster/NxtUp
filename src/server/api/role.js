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
    const { group_id, is_admitted, is_creator } = req.body
    const role = await prisma.Role.create({
      data: {
        user: req.user.id,
        group_id,
        is_admitted, 
        is_creator,
      }
    });
    console.log("req body from post request", req.body);
    res.send(role);
  } catch (err) {
    console.error("Error adding role", err);
    res.status(500).send(err.message);
    next(err);
  }
});


module.exports = router;
