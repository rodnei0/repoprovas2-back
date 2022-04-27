import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from '../src/database.js';

async function getToken() {
    const body = {
        email: "teste@teste.com",
        password: "123"
    };

    const result = await supertest(app).post("/sign-in").send(body);
    const token = result.body.token;

    const config = {
        Authorization: `Bearer ${token}`,
    }

return { body: body, config: config }
};

describe("GET /tests", () => {
    it("giving an invalid token should return status 401", async () => {
        const { config: config } = await getToken();
        config.Authorization = '';

        const result = await supertest(app).get("/tests?groupBy=bananas").set(config);

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
        expect(result.body).not.toBeNull();
    });
});