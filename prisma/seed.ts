import prisma from "../src/database.js";

async function main() {
    await prisma.category.deleteMany();
    await prisma.category.createMany({
        data: [
            { name: 'P1' },
            { name: 'P2' },
            { name: 'P3' }
        ]
    });
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