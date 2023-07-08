import { mongoClient } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";


export async function signup(req, res) {
    const { bodyValues } = res.locals;
    const name = bodyValues.name.result;
    const email = bodyValues.email.result;
    const password = bcrypt.hashSync(bodyValues.password.result, 10);

    try {
        const dbUsers = (await mongoClient.connect()).db().collection("users");

        if (await dbUsers.findOne({ email })) {
            return res.status(409).send("E-mail já cadastrado");
        }
        await dbUsers.insertOne({ name, email, password });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function signin(req, res) {
    const { bodyValues } = res.locals;
    const email = bodyValues.email.result;
    const password = bodyValues.password.result;

    try {
        const db = (await mongoClient.connect()).db();
        const user = await db.collection("users").findOne({ email });

        if (!user) return res.status(404).send("E-mail não cadastrado");
        if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

        const token = uuid();

        await db.collection("sessions").insertOne({ token, userId: user._id });
        res.send(token);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function signout(req, res) {
    try {
        const dbSessions = (await mongoClient.connect()).db().collection("sessions");
        const result = await dbSessions.deleteOne({ token: res.locals.session.token });

        if (result.deletedCount === 0) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}