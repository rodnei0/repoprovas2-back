import app from '../src/app.js';
import supertest from 'supertest';
import prisma from '../src/database.js';
import userBodyFactory from '../src/factories/userBodyFactory.js'

describe("POST /sign-up", () => {
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("giving an invalid body should return status 422", async () => {
        const body = {};

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toEqual(422);
    });

    it("giving a validy body should return status 201 and persist user", async () => {
        const body= userBodyFactory();

        const result = await supertest(app).post("/sign-up").send(body);
        const user = await prisma.user.findUnique({
            where: { email: body.email }
        })

        expect(result.status).toEqual(201);
        expect(user).not.toBeNull();
    });

    it("giving a duplicated email should return status 409", async () => {
        const body= userBodyFactory();
        
        await supertest(app).post("/sign-up").send(body);
        const result = await supertest(app).post("/sign-up").send(body);
        const users = await prisma.user.findMany({
            where: {
              email: body.email,
            },
          });

        expect(result.status).toEqual(409);
        expect(users.length).toEqual(1);
    });
});

describe("POST /sign-in", () => {
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("giving an invalid email should return status 401", async () => {
        const body= userBodyFactory();
        body.email = 'teste2@teste.com';

        const result1 = await supertest(app).post("/sign-in").send(body);

        expect(result1.status).toEqual(401);
    });

    it("giving an invalid password should return status 401", async () => {
        const body= userBodyFactory();
        body.password = '321';

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(401);
    });

    it("giving a valid body should return status 200 and a token", async () => {
        const body= userBodyFactory();

        await supertest(app).post("/sign-up").send(body);
        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(200);
        expect(typeof result.body.token).toEqual("string");
        expect(result.body.token.length).toBeGreaterThan(0);
    });

});

describe("GET /tests", () => {
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("giving an invalid token should return status 401", async () => {
        const { config: config } = await getToken();
        config.Authorization = '';

        const result = await supertest(app).get("/tests?groupBy=disciplines").set(config);

        expect(result.status).toEqual(401);
    });

    it("giving an invalid query param should return status 400", async () => {
        const { config: config } = await getToken();

        const result = await supertest(app).get("/tests?groupBy=bananas").set(config);

        expect(result.status).toEqual(400);
    });

    it("giving a valid query param should return status 200", async () => {
        const { config: config } = await getToken();

        const result = await supertest(app).get("/tests?groupBy=disciplines").set(config);

        expect(result.status).toEqual(200);
        expect(result.body.tests).not.toBeNull();
    });
});

describe("GET /categories", () => {
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("giving an invalid token should return status 401", async () => {
        const { config: config } = await getToken();
        config.Authorization = '';

        const result = await supertest(app).get("/categories").set(config);

        expect(result.status).toEqual(401);
    });

    it("giving a valid token should return status 200 and an object", async () => {
        const { config: config } = await getToken();

        const result = await supertest(app).get("/categories").set(config);

        expect(result.status).toEqual(200);
        expect(typeof result.body).toEqual("object");
    });
});

async function truncateUsers() {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
}

async function disconnect() {
    await prisma.$disconnect();
}

export async function getToken() {
    const body= userBodyFactory();

    await supertest(app).post("/sign-up").send(body);
    const result = await supertest(app).post("/sign-in").send(body);
    const token = result.body.token;

    const config = {
        Authorization: `Bearer ${token}`,
    }

    return { body: body, config: config }
};