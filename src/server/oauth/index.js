const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {v4 : uuidv4} = require("uuid");
const {generateUsername} = require("unique-username-generator")
const { validationResult } = require('express-validator');

router.post("/oauth", async (req, res, next) => {
    const errors = validationResult(req)
    const salt_rounds = 5;
    const password = uuidv4()
    const hashedPassword = await bcrypt.hash(password, salt_rounds)
    
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, sub } = req.body

    async function randomName() {
        let username;
        do {
            // generate a name
            username = generateUsername("", 3)
            // check if the username exists in the database
            var dbuser = await prisma.User.findFirst({where: {username}})
            // if the name does, generate a new username, and recheck the database    
        } while(dbuser);
        // if the name is not found, return it
        console.log(username)
        return username;
    }

    try {
        const existingUser = await prisma.User.findFirst({ where: { email } });
        // if no user is found, make one
        if (!existingUser) {
            console.log("Random name function", randomName())
            const newUser = await prisma.User.create({
                data:{
                    username: await randomName(),
                    password: hashedPassword,
                    email,
                    sub,
                }
            })
            const token = jwt.sign({ id: newUser.id }, process.env.JWT);     
            return res.status(201).send({ 
                token, 
                user: { 
                    id: newUser.id, 
                    email: newUser.email,
                    username: newUser.username
                } 
            })
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
            res.status(201).send({ 
                token, 
                user: { 
                    userId: existingUser.id, 
                    email:existingUser.email, 
                    username: existingUser.username 
                } 
            })
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
                    userId: existingUser.id,
                    email: existingUser.email,
                    username: existingUser.username,
                }
            })
   
        }

    } catch(error) {
        next(error)
    }
});

module.exports = router;