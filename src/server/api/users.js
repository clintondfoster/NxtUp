const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

//Apply Middleware to all routes for user
router.use(protection);

// if isCreator = true, then user can get a list of all users
router.get("/group/:groupId/users", async (req, res, next) => {
    console.log("Received request for users of group:")
    try {
        if (!req.user) {
            return res.status(401).send("User not authenticated.")
        }

        const userRole = await prisma.Role.findFirst({
            where: {
                user_id: req.user.id,
                group_id: Number(req.params.groupId),
                is_creator: true
            }
        });

        if (!userRole) {
            return res.status(403).send("Access denied. Only group creator can view all users.");
        }

        const usersInGroup = await prisma.Role.findMany({
            where: {
                group_id: Number(req.params.groupId)
            },
            include: {
                user: true
            }
        });

        const users = usersInGroup.map(role => ({
            ...role.user,
            is_creator: role.is_creator
        }))

        res.json(users)

    } catch (err) {
        next (err)
        console.error("Error fetching users:", err.message)
    }
    }
)


router.get("/:id", async (req, res, next) => {
    try {
        if (!req.User) {
            console.log(req.User)
            return res.status(401).send("User not authenticated")
        }

        const user = await prisma.User.findUnique({
            where: {
                id: Number(req.params.id),
            }
        });

        if(!user) {
            return res.send(404).send("User not found");
        }

        res.send(user)
    } catch (err) {
        next(err)
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        if (!req.User) {
            return res.status(401).send("User not authenticated")
        }

        const updatedInfo = req.body;

        const updatedUser = await prisma.User.update({
            where: { id: req.user.id },
            data: updatedInfo,
        });

        res.send(updatedUser);
    } catch (err) {
        next(err);
    }
})

router.put("/group/:groupId/users/:userId/role", async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send("User not authenticated");
        }

        //prevent user from updating their own role
        if(req.user.id === Number(req.params.userId)) {
            return res.status(403).send("You cannot modify your own role.");
        }

        const userRole = await prisma.Role.findFirst({
            where: {
                user_id: req.user.id,
                group_id: Number(req.params.groupId),
                is_creator: true
            }
        });

        if (!userRole) {
            return res.status(403).send("Access denied. Only group creator can modify roles.");
        }

        const targetUserRole = await prisma.Role.findFirst({
            where: {
                user_id: Number(req.params.userId),
                group_id: Number(req.params.groupId)
            }
        });

        if (!targetUserRole) {
            return res.status(404).send("Target user's role not found for the specified group.");
        }

        const updatedRole = await prisma.Role.update({
            where: {
              id: targetUserRole.id
            },
            data: {
                is_creator: req.body.is_creator 
            }
        });

        res.json(updatedRole);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const user = await prisma.User.delete({
            where: { id: Number(req.params.id) },
        });
        res.send(user);
    } catch (err) {
        next (err);
}
});

module.exports = router;