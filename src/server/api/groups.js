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

router.get("/:access_code", async (req, res, next) => {
  try {
    const group = await prisma.Group.findFirst({
      where: {
        access_code: req.params.access_code,
      },
    });
    if (!group) {
      return res.status(404).send({ message: "Group with the given code does not exist."});
    }
    res.send(group);
  } catch (err) {
    res.status(500).send({ message: "Internal server error. Please try again later."})
    next(err);
  }
});

// Delete group and all associated data
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.deleteMany({
      where: {
        group_id: Number(id),
      },
    });
    const question = await prisma.question.deleteMany({
      where: {
        group_id: +id,
      },
    });
    const submission = await prisma.submission.deleteMany({
      where: {
        question_id: question.id,
      },
    });
    const vote = await prisma.vote.deleteMany({
      where: {
        submissionId: submission.id,
      },
    });
    const group = await prisma.Group.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(group);
  } catch (err) {
    next(err);
  }
});

router.post("/", protection, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const accessCode = generateCode(5);

    const user = await prisma.user.findUnique({
      where:{ id: userId}
    })

    const username = user.username;

    const group = await prisma.Group.create({
      data: {
        userId: userId,
        name: `${username} - ${accessCode}`,
        access_code: accessCode,
      },
    });

    const role = await prisma.Role.create({
      data: {
        user_id: userId,
        group_id: group.id,
        is_admitted: true,
        is_creator: true,
        is_admin: true,
      },
    });

    const groupUrl = `localhost:3000/groups/${accessCode}`;

    const response = {
      group,
      role,
      url: groupUrl
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
