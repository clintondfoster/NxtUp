const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");
const generateCode = require("../../client/components/inputs/generateCode");

router.get("/", async (req, res, next) => {
  try {
    const allGroups = await prisma.Group.findMany();
    res.send(allGroups);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const group = await prisma.Group.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.send(group);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const group = await prisma.Group.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.send(group);
  } catch (err) {
    next(err);
  }
});

router.post("/", protection, async (req, res, next) => {
  try {
    console.log("req.user", req.user);
    const userId = req.user.id;
    const { name } = req.body;
    const accessCode = generateCode(5); 

    const group = await prisma.Group.create({
      data: {
        userId: userId,
        name,
        access_code: accessCode,
      },
    });

    const role = await prisma.role.create({
      data: {
        user_id: userId,
        group_id: group.id,
        is_admitted: true,
        is_creator: true,
      },
    });

    console.log("req body from post request", req.body);
    const response = {
      group,
      role,
    };
    res.send(response);
  } catch (err) {
    console.error("Error adding group", err);
    res.status(500).send(err.message);
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const group = await prisma.Group.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.send(group);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// * updates required
// * 1. create & assign role when group is created
// * 2.
// * 3.
