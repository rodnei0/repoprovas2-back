import prisma from "../src/database.js";
import { faker } from "@faker-js/faker";

async function main() {
    await prisma.category.deleteMany();
    await prisma.category.createMany({
        data: [
            { name: faker.lorem.word() },
            { name: faker.lorem.word() },
            { name: faker.lorem.word() }
        ]
    });
    
    // await prisma.category.deleteMany();
    // await prisma.category.createMany({
    //     data: [
    //         { name: faker.lorem.word() },
    //         { name: faker.lorem.word() },
    //         { name: faker.lorem.word() }
    //     ]
    // });
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});

// 	await prisma.category.upsert({
//     where: { title: "meu meme" },
//     update: {},
//     create: {
//       title: "meu meme",
//       description: "meu memezin",
//       url: "http://google.com",
//     },
//   });
// }

// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });