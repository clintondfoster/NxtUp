const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");
const bcrypt = require("bcrypt");

//Apply Middleware to all routes for user
router.use(protection);

// all users in a group can see the other members
router.get("/group/:groupId/users", async (req, res, next) => {
    console.log("Received request for users of group:")
    try {
        if (!req.user) {
            return res.status(401).send("User not authenticated.")
        }

        const userGroup = await prisma.Role.findFirst({
            where: {
                user_id: req.user.id,
                group_id: Number(req.params.groupId),
            }
        });

        if (!userGroup) {
            return res.status(403).send("Access denied. You are not a member of this group.");
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
            is_creator: role.is_creator,
            is_admin: role.is_admin
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
        if (!req.user) {
            return res.status(401).send("User not authenticated")
        }

        const { password, username } = req.body;
       

        if (!username) {
            return res.status(400).json({ error: "Username is required"});
        }
        let updateData = {username};

        if (password) {        
        const salt_rounds = 5;
        const hashedPassword = await bcrypt.hash(password, salt_rounds);
        updateData.password = hashedPassword;
        }
const userInUse = await prisma.User.findFirst({
    where: { username },
})

if (userInUse && userInUse.id !== req.user.id) {
   return res.status(400).json("Username already in use.")
}

        const updatedUser = await prisma.User.update({
            where: { id: req.user.id },
            data: updateData,
        });

        res.send(updatedUser);
    } catch (err) {
       console.error("Error updating user:", err.message)
       return res.status(500).json({ error: "Internal server error."})
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
                is_admin: true,
            }
        });

        if (!userRole) {
            return res.status(403).send("Access denied. Only group admin can modify roles.");
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