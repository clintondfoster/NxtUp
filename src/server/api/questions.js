const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");



router.post("/", protection, async (req, res, next) => {
  const { title, group_id } = req.body;
  const user = req.user.id 

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


module.exports = router
