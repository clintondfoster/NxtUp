const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware");
const { check, validationResult } = require('express-validator');


//Register New User
router.post("/register", [ 
    check('email').isEmail().withMessage("Must be a valid email").normalizeEmail(),
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain a number")
        .matches(/[a-zA-Z]/)
        .withMessage("Password must contain a letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter"),
    check('username').notEmpty().withMessage("username is required").trim().escape()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt_rounds = 5;

    try {
        const { email, password, username } = req.body;

    if(!email || !password || !username) {
        return res.status(400).send("Email, username, and password are required");
    }

    //check if the email already exists
    const existingUser = await prisma.User.findUnique({
        where: { username },
    });

    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, salt_rounds);

    const user = await prisma.User.create({
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
            userId: user.id,
            username: user.username,
            email: user.email,
        }
    });
} catch (err) {
    next (err);
}
});

// Login User
router.post("/login", async (req, res, next) => {
    
    try {
        console.log("Login request recieved", req.body);
        const { username, email, password } = req.body;

        const user = await prisma.User.findUnique({
            where: { username },
        });

        console.log("User found:", user);
        if (!user) {
            return res.status(401).send("Invalid Login");
        }

        const isValid = await bcrypt.compare(password, user.password);
        console.log("password verification:", isValid)

        if (!isValid) {
            return res.status(401).send("Invalid Login");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT);
        res.send({
            token,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        next (err);
    }
})

router.get("/me", authorization, async (req, res, next) => {
   console.log("Endpoint /me activated");
    if(!req.user) {
        return res.send({});
    }

    try {
        const user = await prisma.User.findUnique({
            where: { id: req.user.id },
        });
        res.setHeader("Content-Type", "application/json");
        res.send(user);
        console.log("router/me:", req.user);
    } catch (err) {
        console.log("error is /me router:", err)
        next(err);
    }
});

module.exports = router;