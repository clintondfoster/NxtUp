const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protection = require("../middleware");

//Apply Middleware to all routes for user
router.use(protection);

// router.get("/", async (req, res, next) => {
//     try {
//         if (!req.user || !req.user.is)



router.get("/:id", async (req, res, next) => {
    try {
        if (!req.user) {
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