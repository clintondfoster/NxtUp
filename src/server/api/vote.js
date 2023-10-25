const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

// Create vote if not exist, delete vote if exists
router.post("/", protection, async (req, res, next) => {
  console.log("body", req.body);
  try {
    const existVote = await prisma.vote.findFirst({
      where: {
        submissionId: +req.body.submissionId,
        user_id: req.user.id,
      },
    });
    if (existVote) {
      await prisma.vote.delete({
        where: {
          id: existVote.id,
          submissionId: +req.body.submissionId,
          user_id: req.user.id,
        },
      });
    } else {
      const createVote = await prisma.vote.create({
        data: {
          submissionId: +req.body.submissionId,
          user_id: req.user.id,
        },
      });
    }
    res.status(200).send(createVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/voted/:submissionId/:userId", async (req, res, next) => {
  try {
    const validVote = await prisma.vote.findFirst({
      where: {
        submissionId: +req.params.submissionId,
        user_id: +req.params.userId,
      },
    });
    if (validVote) {
      res.status(200).send(validVote);
      return;
    } else {
      res.status(404).send(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:submissionId", async (req, res, next) => {
  try {
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        id: +req.params.submissionId,
      },
      include: {
        Vote: {
          include: {
            submission:true,
          },
        },
      },
    });
    res.status(200).send(activeSubmission.Vote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;
