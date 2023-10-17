const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");


// submit a vote for a response
router.post("/", protection, async (req, res, next) => {
  try {

    const activeSubmission = await prisma.submission.findFirst({
      where: {
        question_id: req.question_id,
      },
    });
    const createVote = await prisma.vote.create({
      data: {
        submissionId: activeSubmission.id,
        user_id: req.user.id,
      },
    });
    res.status(200).send(createVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {

    const activeSubmission = await prisma.submission.findFirst({
      where: {
        question_id: req.question.id,
      },
    });
    const deleteVote = await prisma.vote.delete({
      data: {
        submissionId: activeSubmission.id,
        user_id: req.user.id,
      },
    });
    res.status(200).send(deleteVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// get all votes by submission id
router.get("/", async (req, res, next) => {
  try {
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        question_id: req.question.id,
      },
    });
    const allVotes = await prisma.vote.findMany({
      where: {
        submissionId: activeSubmission.id,
      },
    });
    res.status(200).send(allVotes);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
