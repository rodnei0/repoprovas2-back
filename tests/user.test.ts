import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from '../src/database.js';

describe("POST /sign-up", () => {
    it("giving an invalid body should return status 422", async () => {
        const body = { item: "cenoura" };

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toEqual(422);
    });

    // esperando pela aula do dia 27/04

    // it("giving a validy body should return status 201", async () => {
    //     const body = { 
    //         email: "rod@teste.com",
    //         password: "123"
    //     };

    //     const result = await supertest(app).post("/sign-up").send(body);
    //     const user = await prisma.user.findUnique({
    //         where: { email: body.email}
    //     })

    //     expect(result.status).toEqual(201);
    //     expect(user).not.toBeNull();
    // });

    it("giving a duplicated email should return status 409", async () => {
        const body = { 
            email: "rod@teste.com",
            password: "123"
        };

        await supertest(app).post("/sign-up").send(body);
        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toEqual(409);
    });
});

describe("POST /sign-in", () => {
    it("giving an invalid email should return status 401", async () => {
        const body = { 
            email: "teste@teste.com",
            password: "123"
        };

        await supertest(app).post("/sign-up").send(body);
        body.email = 'teste2@teste.com';
        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(401);
    });

    it("giving an invalid password should return status 401", async () => {
        const body = { 
            email: "teste@teste.com",
            password: "123"
        };

        await supertest(app).post("/sign-up").send(body);
        body.password = '321';
        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(401);
    });

    it("giving a valid body should return status 200 and a token", async () => {
        const body = { 
            email: "teste@teste.com",
            password: "123"
        };

        await supertest(app).post("/sign-up").send(body);
        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toEqual(200);
        expect(result.body.token).not.toBeNull();
    });

});