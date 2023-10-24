const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

router.get("/:id", async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        Submission: true,
        Submission: {
          include: {
            Vote: true,
          },
        },
      },
    });

    res.status(200).send(question);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id/submissions", async (req, res, next) => {
  try {
    // Fetch submissions related to the question id
    const submissions = await prisma.submission.findMany({
      where: {
        question_id: Number(req.params.id),
      },
      include: {
        user: true,
      },
    });

    // If no submissions found for the question
    // if (submissions.length === 0) {
    //   return res.status(404).json({ error: "No submissions found for this question" });
    // }

    res.status(200).send(submissions);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/group/:access_code/active", async (req, res, next) => {
  try {
    const group = await prisma.Group.findFirst({
      where: {
        access_code: req.params.access_code,
      },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const activeQuestions = await prisma.question.findMany({
      where: {
        group_id: group.id,
        is_active: true,
      },
    });
    res.status(200).send(activeQuestions);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", protection, async (req, res, next) => {
  const { title, group_id } = req.body;
  const user = req.user.id;

  try {
    const groupCreator = await prisma.role.findFirst({
      where: {
        user_id: req.user.id,
        is_creator: true,
      },
    });
    const createdQuestion = await prisma.question.create({
      data: {
        title,
        group_id,
        user_id: user,
        is_active: true,
      },
    });
    res.status(200).send(createdQuestion);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:group_id", async (req, res, next) => {
  const { group_id } = req.body;
  try {
    const activeQuestion = await prisma.Question.findFirst({
      where: {
        group_id,
        is_active: true,
      },
    });
    res.send(activeQuestion);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
