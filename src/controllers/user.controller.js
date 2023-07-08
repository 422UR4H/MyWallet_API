import { mongoClient } from "../database/database.connection.js";

export async function getUser(req, res) {
    try {
        const dbUsers = (await mongoClient.connect()).db().collection("users");
        const user = await dbUsers.findOne({ _id: res.locals.session.userId });

        delete user.password;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}