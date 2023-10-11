const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware");


//Register New User
router.post("/register", async (req, res, next) => {
    
    const salt_rounds = 5;

    try {
        const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    //check if the email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, salt_rounds);

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword
        },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT);

    res.status(201).send({
        message: "You have registered a new account!",
        token,
        user: {
            user_id: user.id,
            username: user.username,
        }
    });
} catch (err) {
    next (err);
}
});

// Login User
router.post("/login", async (req, res, next) => {
    
    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // console.log("User found:", user);
        if (!user) {
            return res.status(401).send("Invalid Login");
        }

        const isValid = await bcrypt.compare(password, user.password);
        // console.log("password verification:", isValid)

        if (!isValid) {
            return res.status(401).send("Invalid Login");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT);
        res.send({
            token,
            user: {
                user_id: user.id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        next (err);
    }
})

router.get("/me", authorization, async (req, res, next) => {
   
    if(!req.user) {
        return res.send({});
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        res.setHeader("Content-Type", application/json);
        res.send(user);
        // console.log("router/me:", req.user);
    } catch (err) {
        // console.log("error is /me router:", err)
        next(err);
    }
});

module.exports = router;