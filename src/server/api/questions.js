const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const allQuestions = await prisma.Question.findMany(); 
    res.send(allQuestions)
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
    try {
      const question = await prisma.Question.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      res.send(question);
    } catch (err) {
      next(err);
    }
  });
router.get("/group/:id", async (req, res, next) => {
    try {
      const activeQuestion = await prisma.Question.findMany({
        where: {
            group_id: Number(req.params.id),
            is_active: true,
        },
      });
      res.send(activeQuestion);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id",  async (req, res, next) => {
  
    try {
      const question = await prisma.Question.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.send(question);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const question = await prisma.Question.create({
        data: req.body,
      });
      console.log('req body from post request', req.body);
      res.send(question);
    } catch (err) {
      console.error("Error adding group", err)
      res.status(500).send(err.message);
      next(err);
    }
  });

  router.put("/:id",  async (req, res, next) => {
  
    try {
      const question = await prisma.Question.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
      });
      res.send(question);
    } catch (err) {
      next(err);
    }
  });


module.exports = router