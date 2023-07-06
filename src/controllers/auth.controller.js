import { loginSchema, userSchema } from "../schemas.js";
import { mongoClient } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";


export async function signup(req, res) {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });

    if (error) return res.status(422).send(error.details.map(d => d.message));

    const password = bcrypt.hashSync(value.password.result, 10);
    const user = { name: value.name.result, email: value.email.result, password };

    try {
        await mongoClient.connect();
        const users = mongoClient.db().collection("users");

        if (await users.findOne({ email: user.email })) {
            return res.status(409).send("E-mail já cadastrado");
        }
        await users.insertOne(user);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function signin(req, res) {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    
    if (error) return res.status(422).send(error.details.map(d => d.message));

    const email = value.email.result;
    const password = value.password.result;
    
    try {
        await mongoClient.connect();
        const db = mongoClient.db();

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
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        await mongoClient.connect();
        const db = mongoClient.db();

        const result = await db.collection("sessions").deleteOne({ token });
        if (result.deletedCount === 0) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}