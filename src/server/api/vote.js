const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

// submit a vote for a submission
router.post("/", protection, async (req, res, next) => {
  console.log("body", req.body);
  try {
    const createVote = await prisma.vote.create({
      data: {
        submissionId: +req.body.submissionId,
        user_id: req.user.id,
      },
    });
    res.status(200).send(createVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// delete a vote for a submission
router.delete("/:id",  async (req, res, next) => {
  console.log("body", req.body);
  try {
    const deleteVote = await prisma.vote.delete({
      where: {
        // submissionId: +req.body.submissionId,
        // user_id: req.user.id,
        id: Number(req.params.id),
      },
    });
    res.status(200).send(deleteVote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
// get all votes by submission id
router.get("/:submissionId", async (req, res, next) => {
  try {
    const activeSubmission = await prisma.submission.findFirst({
      where: {
        id: +req.params.submissionId,
      },
      include: {
        Vote: true,
      },
    });
    res.status(200).send(activeSubmission.Vote);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
