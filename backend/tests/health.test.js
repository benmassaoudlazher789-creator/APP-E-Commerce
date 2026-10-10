const request = require("supertest");
const app = require("../app");

describe("GET /api/health", () => {
    it("répond 200 avec la base connectée", async () => {
        const res = await request(app).get("/api/health");

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/application\/json/);
        expect(res.headers["cache-control"]).toBe("no-store");
        expect(res.body).toMatchObject({ status: "ok", db: "up", version: "dev" });
        expect(typeof res.body.uptime).toBe("number");
        expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
    });

    it("n'expose aucune information sensible", async () => {
        const res = await request(app).get("/api/health");

        expect(Object.keys(res.body).sort()).toEqual(["db", "status", "timestamp", "uptime", "version"]);
    });
});
