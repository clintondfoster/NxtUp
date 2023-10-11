const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");

async function seed() {
    console.log("Seeding the database")
    await prisma.user.deleteMany()
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
}