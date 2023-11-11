import request from "supertest";

import app from "../src/app";
import mongoose from "mongoose";
import { config } from "../src/config/config";


/* Connecting to the test database before each test. */


describe("App health endpoint", () => {
    test("Test server status", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Server is running at http://localhost:8080');
    });
});