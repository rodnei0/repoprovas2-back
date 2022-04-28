import app from '../app.js'
import supertest from 'supertest';

export async function createUser() {
    const body = { 
        email: "rod@teste.com",
        password: "123"
    };
    
    const result = await supertest(app).post("/sign-up").send(body);
    
    return { body:body, result: result };
}

export async function getToken() {
    const body = { 
        email: "rod@teste.com",
        password: "123"
    };

     await supertest(app).post("/sign-up").send(body);
    const result = await supertest(app).post("/sign-in").send(body);
    const token = result.body.token;

    const config = {
        Authorization: `Bearer ${token}`,
    }

    return { body: body, config: config }
};