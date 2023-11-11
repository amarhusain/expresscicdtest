import request from "supertest";

import app from "../../src/app";

describe("User routes", () => {
    test("Get all users", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toEqual(200);
    });
});