const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const cloudinary = require("../util/cloudinary");
const { createUser, tokenFor } = require("./helpers");

describe("Routes protégées (isAuth)", () => {
    it("refuse l'accès sans token", async () => {
        const res = await request(app).get("/api/auth/current");

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("No token provided");
    });

    it("refuse un token invalide", async () => {
        const res = await request(app).get("/api/auth/current").set("authorization", "not-a-jwt");

        expect(res.status).toBe(401);
    });

    it("refuse un token signé avec une autre clé", async () => {
        const user = await createUser();
        const forged = jwt.sign({ id: user._id }, "another-key");

        const res = await request(app).get("/api/auth/current").set("authorization", forged);

        expect(res.status).toBe(401);
    });

    it("refuse un token dont l'utilisateur n'existe plus", async () => {
        const user = await createUser();
        const token = tokenFor(user);
        await user.deleteOne();

        const res = await request(app).get("/api/auth/current").set("authorization", token);

        expect(res.status).toBe(404);
    });

    it("refuse le panier sans token", async () => {
        const res = await request(app).get("/api/cart");

        expect(res.status).toBe(403);
    });
});

describe("Routes admin (isAuth + isRole('admin'))", () => {
    it("refuse /api/admin/stats sans token", async () => {
        const res = await request(app).get("/api/admin/stats");

        expect(res.status).toBe(403);
    });

    it("refuse /api/admin/stats à un utilisateur non admin", async () => {
        const client = await createUser({ role: "client" });

        const res = await request(app).get("/api/admin/stats").set("authorization", tokenFor(client));

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access denied: insufficient role");
    });

    it("refuse l'ajout de produit à un non admin, sans aucun upload Cloudinary", async () => {
        const client = await createUser({ role: "client" });

        const res = await request(app)
            .post("/api/product/addProd")
            .set("authorization", tokenFor(client))
            .send({ title: "Intrus", price: 1 });

        expect(res.status).toBe(403);
        expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it("refuse la suppression de produit à un non admin", async () => {
        const client = await createUser({ role: "client" });

        const res = await request(app)
            .delete("/api/product/507f1f77bcf86cd799439011")
            .set("authorization", tokenFor(client));

        expect(res.status).toBe(403);
    });

    it("autorise un admin sur /api/admin/stats", async () => {
        const admin = await createUser({ role: "admin" });

        const res = await request(app).get("/api/admin/stats").set("authorization", tokenFor(admin));

        expect(res.status).toBe(200);
    });
});
