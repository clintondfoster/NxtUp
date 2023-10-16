const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// submit a vote for a response
router.post("/", async (req, res, next) => {
  try {
    const user = 2;
    const question = 4;
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        question_id: question,
      },
    });
    const createVote = await prisma.vote.create({
      data: {
        submissionId: activeSubmission.id,
        user_id: user,
      },
    });
    res.status(200).send(createVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// get all votes by submission id
router.get("/", async (req, res, next) => {
  try {
    const question = 4;
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        question_id: question,
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
