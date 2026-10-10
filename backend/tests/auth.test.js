const request = require("supertest");
const app = require("../app");
const User = require("../model/User");
const { createUser, tokenFor } = require("./helpers");

// /login est limité à 5 requêtes par IP sur 15 min (loginLimiter) : ce fichier reste sous ce seuil
// (le compteur est en mémoire et Jest recharge les modules pour chaque fichier de test).

const newUser = { name: "Alice", email: "alice@test.local", password: "secret123" };

// le mot de passe (en clair ou haché) ne doit apparaître nulle part dans la réponse
const expectNoPassword = (body) => {
    const raw = JSON.stringify(body);
    expect(raw).not.toMatch(/"password"/);
    expect(raw).not.toContain(newUser.password);
};

describe("POST /api/auth/register", () => {
    it("crée le compte, renvoie un token et aucun mot de passe", async () => {
        const res = await request(app).post("/api/auth/register").send(newUser);

        expect(res.status).toBe(201);
        expect(typeof res.body.token).toBe("string");
        expect(res.body.user).toMatchObject({ name: "Alice", email: "alice@test.local", role: "client" });
        expectNoPassword(res.body);
    });

    it("stocke le mot de passe haché, jamais en clair", async () => {
        await request(app).post("/api/auth/register").send(newUser);

        const saved = await User.findOne({ email: newUser.email });
        expect(saved.password).not.toBe(newUser.password);
        expect(saved.password).toMatch(/^\$2[aby]\$/);
    });

    it("refuse un email déjà utilisé", async () => {
        await createUser({ email: newUser.email });

        const res = await request(app).post("/api/auth/register").send(newUser);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    it("refuse des données invalides (validation)", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "", email: "pas-un-email", password: "123" });

        expect(res.status).toBe(400);
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.map((e) => e.path).sort()).toEqual(["email", "name", "password"]);
    });
});

describe("POST /api/auth/login", () => {
    beforeEach(async () => {
        await createUser({ name: newUser.name, email: newUser.email, password: newUser.password });
    });

    it("connecte avec les bons identifiants, sans renvoyer le mot de passe", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: newUser.email, password: newUser.password });

        expect(res.status).toBe(200);
        expect(typeof res.body.token).toBe("string");
        expect(res.body.user).toMatchObject({ name: "Alice", email: newUser.email, role: "client" });
        expectNoPassword(res.body);
    });

    it("refuse un mauvais mot de passe", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: newUser.email, password: "wrongpass" });

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    it("refuse un email inconnu", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "inconnu@test.local", password: newUser.password });

        expect(res.status).toBe(400);
        expect(res.body.token).toBeUndefined();
    });
});

describe("GET /api/auth/current", () => {
    it("renvoie l'utilisateur connecté sans mot de passe", async () => {
        const user = await createUser({ name: "Alice", email: newUser.email });

        const res = await request(app).get("/api/auth/current").set("authorization", tokenFor(user));

        expect(res.status).toBe(200);
        expect(res.body.user).toMatchObject({ name: "Alice", email: newUser.email, role: "client" });
        expectNoPassword(res.body);
    });
});
