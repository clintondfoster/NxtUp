const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");
const { io } = require("../main");

router.get("/", async (req, res, next) => {
  try {
    const allSubmissions = await prisma.Submission.findMany();
    res.send(allSubmissions);
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const submission = await prisma.Submission.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.send(submission);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const submission = await prisma.Submission.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.send(submission);
  } catch (err) {
    next(err);
  }
});

router.post("/", protection, async (req, res, next) => {
  if (req.user.id) {
  } else {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const { link, group_id, userId, question_id } = req.body;
    const activeQuestion = await prisma.Question.findFirst({
      where: {
        id: Number(question_id),
        group_id: group_id,
        is_active: true,
      },
    });
    if (!activeQuestion) {
      return res
        .status(404)
        .json({ error: "No active question found for this group." });
    }
    const newSubmission = await prisma.Submission.create({
      data: {
        link: link,
        question_id: Number(question_id),
        user_id: req.user.id,
      },
    });

    req.app.locals.io.emit("new_submission", newSubmission);

    res.json(newSubmission);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedSubmission = await prisma.Submission.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.send(updatedSubmission);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
