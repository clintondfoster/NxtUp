const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const submissions = require("./data/submissions.js")
const roles = require("./data/roles.js")
const questions = require("./data/questions.js")
const groups = require("./data/groups.js")

async function seed() {

    const deleteUsers = prisma.user.deleteMany({
        where: {
            id: {not: 1}
        }
    })
    const deleteGroups = prisma.group.deleteMany()
    const deleteRoles = prisma.role.deleteMany()
    const deleteInput = prisma.input.deleteMany()
    const deleteSubmissions = prisma.submission.deleteMany()
    await prisma.$transaction([deleteUsers, deleteGroups, deleteRoles, deleteInput, deleteSubmissions])

    await prisma.user.create({
        data: {
            username: "admin",
            password: hashedPassword,
            email: "admin@email.com"
        }
    })
    for (let i = 0; i < 10; i++) {
        const salt_rounds = 5;
        const hashedPassword = await bcrypt.hash("pass", salt_rounds)
        
        await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                password: hashedPassword,
                email: faker.internet.email(),
            }
        })
    }
    
   
    for (let group in groups) {
        await prisma.group.create({
            data: group
        })
    }
    
   
    for (let question in questions) {
        await prisma.question.create({
            data: question
        })
    }
    
   
    for (let role in roles) {
        await prisma.role.create({
            data: role
        })
    }
    
   
    for (let submission in submissions) {
        await prisma.submission.create({
            data: submission
        })
    }
}

console.log("Seeded the database")
seed().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})