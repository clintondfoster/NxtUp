const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

router.post("/", protection, async (req, res, next) => {
  try {
    const { accessCode } = req.body;
    const userId = req.user.id;
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
        is_admin: false,
      },
    });
    res.send(role);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allRoles = await prisma.Role.findMany();
    res.send(allRoles);
  } catch (err) {
    next(err);
  }
});

router.get("/user_groups", protection, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userRolesWithGroups = await prisma.Role.findMany({
      where: {
        user_id: userId,
      },
      include: {
        group: true,
      },
    });

    const userGroups = userRolesWithGroups.map((role) => role.group);

    res.send(userGroups);
  } catch (err) {
    next(err);
  }
});

router.get("/users_history", protection, async (req, res, next) => {
  try {
    //get user
    const userId = req.user.id;
    //

    //find group where user is admitted
    const rolesWhereAdmitted = await prisma.Role.findMany({
      where: {
        user_id: userId,
        is_admitted: true,
      },
    });

    //

    const groupIds = rolesWhereAdmitted.map((role) => role.group_id);

    //

    //In each group, fine the questions that are inactive
    const questions = await prisma.Question.findMany({
      where: {
        group_id: {
          in: groupIds,
        },
        is_active: false,
      },
    });

    const questionIds = questions.map((question) => question.id);

    const submissions = await prisma.Submission.findMany({
      where: {
        user_id: userId,
        question_id: {
          in: questionIds,
        },
      },
      include: {
        question: true,
      },
    });

    //
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching user submission history", err);
    next(err);
  }
});


module.exports = router;
