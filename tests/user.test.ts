import app from '../src/app.js';
import supertest from 'supertest';
import prisma  from '../src/database.js';
import { createUser } from '../src/factories/userFactory.js'


afterAll(async () => {
    await prisma.$disconnect();
});

describe("POST /sign-up", () => {
    beforeEach(truncateUsers);
    
    it("giving an invalid body should return status 422", async () => {
        const body = { item: "cenoura" };

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toEqual(422);
    });

    it("giving a validy body should return status 201 and persist user", async () => {
        const { body:body, result: result } = await createUser();

        const user = await prisma.user.findUnique({
            where: { email: body.email}
        })

        expect(result.status).toEqual(201);
        expect(user).not.toBeNull();
    });

    it("giving a duplicated email should return status 409", async () => {
        const { body:body } = await createUser();

        await supertest(app).post("/sign-up").send(body);
        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toEqual(409);
    });
});

describe("POST /sign-in", () => {
    beforeEach(truncateUsers);
    
    it("giving an invalid email should return status 401", async () => {
        const { body:body } = await createUser();

        body.email = 'teste2@teste.com';
        const result1 = await supertest(app).post("/sign-in").send(body);

        expect(result1.status).toEqual(401);
    });

    it("giving an invalid password should return status 401", async () => {
        const { body:body } = await createUser();
        body.password = '321';
        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(401);
    });

    it("giving a valid body should return status 200 and a token", async () => {
        const { body:body } = await createUser();

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(200);
        expect(result.body.token).not.toBeNull();
    });

});

async function truncateUsers() {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
}