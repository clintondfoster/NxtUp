const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

router.get("/", async (req, res, next) => {
  try {
    const allRoles = await prisma.Role.findMany();
    res.send(allRoles);
  } catch (err) {
    next(err);
  }
});

router.get("/user_groups", protection, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userRolesWithGroups = await prisma.Role.findMany({
      where: {
        user_id: userId,
      },
      include: {
        group: true,
      }
    });

    const userGroups = userRolesWithGroups.map(role => role.group);

    res.send(userGroups);

  } catch (err) {
    next(err)
  }
});

router.get("/users_history", protection, async (req, res, next) => {
  try{
    //get user
    const userId = req.user.id;
    // console.log("From Roles api router: UserID:", userId)


    //find group where user is admitted
    const rolesWhereAdmitted = await prisma.Role.findMany({
      where: {
        user_id: userId,
        is_admitted: true,
      },
    });

    // console.log("Roles api - rolesWhereAdmitted:", rolesWhereAdmitted);

    const groupIds = rolesWhereAdmitted.map(role => role.group_id);

    // console.log("Roles api groupIds", groupIds)

    //In each group, fine the questions that are inactive
    const questions = await prisma.Question.findMany({
      where: {
        group_id: {
          in: groupIds,
        },
        is_active: false,
      },
    });

    const questionIds = questions.map(question => question.id);

    const submissions = await prisma.Submission.findMany({
      where: {
        user_id: userId,
        question_id: {
          in: questionIds,
        },
      },
      include: {
        question: true,
      },
    });

    // console.log("Roles with admitted status:", rolesWhereAdmitted)
    res.json(submissions);

  } catch (err) {
    console.error("Error fetching user submission history", err)
    next (err)
  }
});

// router.get("/created-questions", protection, async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     // const groupId = req.group.id;

//     console.log("UserId:", userId)
//     console.log("groupId:", groupId)

//     if(!groupId) {
//       return res.status(400).json({ error: "Group Id is required"})
//     }

//     const creatorRole = await prisma.Role.findFirst({
//       where: {
//         user_id: userId,
//         is_creator: true,
//       }
//     });

//     if(!creatorRole) {
//       return res.json([])
//     }


//     const questions = await prisma.Question.findMany({
//       where: {
//         user_id: userId,
//         is_active: true,
//         group_id: Number(groupId)
//       },
//     });
//     res.json(questions);
//   } catch (err) {
//     next(err)
//   }
// });

// router.get("/joined-group-questions", protection, async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const roles = await prisma.Role.findMany({
//       where: {
//         user_id: userId,
//         is_admitted: true,
//       },
//     });

//     const groupIds = roles.map(role => role.group_id);
//     const questions = await prisma.Question.findMany({
//       where: {
//         group_id: {
//           in: groupIds,
//         },
//         is_active: true,
//       },
//     });
//     res.json(questions);
//   } catch (err) {
//     console.error("Error fetching questions from joined groups", err)
//     next(err)
//   }
// })


router.post("/", protection, async (req, res, next) => {
  try {
    const { accessCode } = req.body;
    const userId = req.user.id
    const group = await prisma.group.findFirst({
      where: {
        access_code: accessCode,
      },
    });
    const role = await prisma.Role.create({
      data: {
        user_id: userId,
        group_id: group.id,
        is_admitted: true,
        is_creator: false,
      },
    });
    res.send(role);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
