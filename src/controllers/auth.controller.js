import { db, userSchema } from "../app.js";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import { stripHtml } from "string-strip-html";
import Joi from "joi";
import bcrypt from "bcrypt";


export async function signup(req, res) {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });

    if (error) return res.status(422).send(error.details.map(d => d.message));

    const password = bcrypt(value.password.result, 10);
    const user = { name: value.name.result, email: value.email.result, password };

    try {
        if (await db.collection("users").findOne({ email })) {
            return res.status(409).send("E-mail já cadastrado")
        }
        await db.collection("users").insertOne(user);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signin(req, res) {

}