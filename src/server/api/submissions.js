const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


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
  
router.post("/", async (req, res, next) => {
    try {

        const activeQuestion = await prisma.Question.findFirst({
          where: {
            group_id: req.group_id,
            is_active: true,
          },
        });

        if (!activeQuestion) {
          res.status(404).send("No active question found for this group.")
        }

      const { link, user_id, question_id } = req.body; 
            const newSubmission = await prisma.Submission.create({
            data: {
              link: link,
              user_id: req.user.id,
              question_id: activeQuestion.id
            },
          });
          console.log("Req body from create submission,", req.body);
    
          res.send(newSubmission);
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