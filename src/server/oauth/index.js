const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {v4 : uuidv4} = require("uuid");
const { validationResult } = require('express-validator');

router.post("/oauth", async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, sub } = req.body

    function randomName() {
        return "user"+uuidv4()
    }
    function randomPass() {
        return uuidv4()
    }

    try {
        const existingUser = await prisma.User.findFirst({ where: { email } });
        // if no user is found, make one
        if (!existingUser) {
            const newUser = await prisma.User.create({
                data:{
                    username: randomName(),
                    password: randomPass(),
                    email,
                    sub,
                }
            })
            const token = jwt.sign({ id: newUser.id }, process.env.JWT);     
            return res.status(201).send({ token, user: { id: newUser.id, username: newUser.username } })
        }

        // if a user was created internally, update it with OAuth info
        if (existingUser && !existingUser.sub) {
            const update = await prisma.User.update({
                where: {
                    id: existingUser.id,
                    email
                },
                data: {sub}
            })
            const token = jwt.sign({ id: existingUser.id }, process.env.JWT); 
            res.status(201).send({ token, user: { id: existingUser.id, username: existingUser.username } })
        }

        // if the token sub and the user sub are different, error out
        if (existingUser.sub !== sub) {
            return res.status(401).send("Invalid login")
        }

        // if email and sub in token match the db, login
        if (existingUser.email === email && existingUser.sub === sub) {
            const token = jwt.sign({ id: existingUser.id }, process.env.JWT);
            res.status(201).send({
                token,
                user: {
                    id: existingUser.id,
                    username: existingUser.username,
                }
            })
   
        }

    } catch(error) {
        next(error)
    }
});

module.exports = router;