const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const protection = require("../middleware")

const responseError = (res, code, message) => res.status(code).json({ error: message});

async function checkEmailExists(req, res, next) {
    const { email } = req.body;
    if(!email) {
        return responseError(res, 400, 'Valid email is required.')
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return responseError(res, 409, "Account already exists. Please login.")
        } next ();
    } catch (error) {
        next (error);
    }
}
async function checkUsernameExists (req, res, next) {
    const { username } = req.body;
    if(!username) {
        return responseError(res, 400, "Username is required.")
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { username: username },
        });
        if (existingUser) {
            return responseError(res, 409, 'That username already exists. Please try again.')
        }
        next();
    } catch (err) {
        next(err)
    }
}

router.post("/register", checkEmailExists, checkUsernameExists, async (req, res,next)=>{

const { username, email, password } = req.body;
    const salt_rounds = 5;
    const hashedPassword = await bcrypt.hash(password, salt_rounds)

    try{
        const user = await prisma.user.create({
            data:{
                username: username,
                password: hashedPassword,
                email: email
            }
        })

        const token = jwt.sign({id:user.id}, process.env.JWT)

        res.status(201).send({token, user:{
            userId: user.id, 
            username: user.username,
            email: user.email,
        }})

    }catch(err) {
        next(err)
    }

})

router.post("/login", async (req, res,next)=>{
    try{
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {email: email}
        })

        const isValid = await bcrypt.compare(req.body.password, user.password);

        if(!user || !isValid){
            return responseError(res, 401, "Invalid login credentials.")
        }

        const token = jwt.sign({id:user.id}, process.env.JWT)

        res.send({token, user:{
            userId: user.id, 
            email: user.email,
            username: user.username,
        }})

    }catch(err){
        next(err);
    }
});

router.get("/me", protection, async (req, res,next)=>{
    console.log("endpoint /me activated,")
    if(!req.user){
        return res.send({})
    }
    try{
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            include: { Role: true }
        });

        if(!user) {
            return res.status(404).send("User not found");
        }

        const isCreator = user.Role.some(role => role.is_creator) || false;
        const isAdmitted = user.Role.some(role => role.is_admitted) || false;
        const isAdmin = user.Role.some(role => role.is_admin) || false;


        res.setHeader("Content-Type", "application/json");

        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.Role,
                sub: user.sub,
                isCreator: isCreator,
                isAdmitted: isAdmitted,
                isAdmin: isAdmin
            }
        })
        // res.send(user);
        console.log("router /me", req.user);
    }catch(err){
        next(err)
    }
})

module.exports= router;