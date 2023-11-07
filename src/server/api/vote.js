const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

// Create vote if not exist, delete vote if exists
router.post("/", protection, async (req, res, next) => {
  let createVote;
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
      createVote = await prisma.vote.create({
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

router.get("/voted/:submissionId/", protection, async (req, res, next) => {

  const userId = parseInt(req.user.id)
  const submissionId = parseInt(req.params.submissionId)
  try {
    const activeVote = await prisma.vote.findFirst({
      where: {
        user_id: userId,
        submissionId,
      },
    });

    res.status(200).send(activeVote);
    console.log('active vote from get', activeVote)
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// const activeSubmission = await prisma.submission.findFirst({
//   where: {
//     id: +req.params.submissionId,
//   },
//   include: {
//     Vote: {
//       where: {
//         user_id: +req.params.userId,
//         submission_id: +req.params.submissionId,
//       },
//       include: {
//         submission:true,
//       },
//     },
//   },
// });
// res.status(200).send(activeSubmission.Vote);

router.get("/:submissionId", async (req, res, next) => {
  try {
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        id: +req.params.submissionId,
      },
      include: {
        Vote: {
          include: {
            submission: true,
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
