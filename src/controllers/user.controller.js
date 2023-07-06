import { mongoClient } from "../app.js";

export async function getUser(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        await mongoClient.connect();
        const db = mongoClient.db();

        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const user = await db.collection("users").findOne({ _id: session.userId });
        delete user.password;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}