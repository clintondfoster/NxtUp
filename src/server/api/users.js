const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authorization = require("../middleware");

router.use(authorization);


router.get("/:id", async (req, res, next) => {
    try {
        if (!req.user) {
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