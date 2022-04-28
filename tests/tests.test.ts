import app from '../src/app.js';
import supertest from 'supertest';
import prisma from '../src/database.js';
import { getToken } from '../src/factories/userFactory.js'


afterAll(async () => {
    await prisma.$disconnect();
});

describe("GET /tests", () => {
    beforeEach(truncateUsers);
    it("giving an invalid token should return status 401", async () => {
        const { config: config } = await getToken();
        config.Authorization = '';

        const result = await supertest(app).get("/tests?groupBy=bananas").set(config);

        expect(result.status).toEqual(401);
    });

    // it("giving an invalid query param should return status 400", async () => {
    //     const { config: config } = await getToken();

    //     const result = await supertest(app).get("/tests?groupBy=bananas").set(config);

    //     expect(result.status).toEqual(400);
    // });

    // it("giving a valid query param should return status 200", async () => {
    //     const { config: config } = await getToken();

    //     const result = await supertest(app).get("/tests?groupBy=disciplines").set(config);

    //     expect(result.status).toEqual(200);
    //     expect(result.body).not.toBeNull();
    // });
});

async function truncateUsers() {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
}