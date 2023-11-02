const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const protection = require("../middleware")


router.post("/register", async (req, res,next)=>{

    const salt_rounds = 5;
    const hashedPassword = await bcrypt.hash(req.body.password, salt_rounds)

    try{
        const user = await prisma.user.create({
            data:{
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email
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
        const user = await  prisma.user.findUnique({
            where: {email: req.body.email}
        })

        if(!user){
            return res.status(401).send("Invalid Login")
        }

        const isValid = await bcrypt.compare(req.body.password, user.password)

        if(!isValid){
            return res.status(401).send("Invalid Login")
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