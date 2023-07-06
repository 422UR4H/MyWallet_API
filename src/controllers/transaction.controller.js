import dayjs from "dayjs";
import { mongoClient } from "../database/database.connection.js";
import { transactionSchema } from "../schemas/schemas.user.js";


export async function postTransaction(req, res) {
    const { error, value } = transactionSchema.validate(
        { ...req.body, type: req.params.type }, { abortEarly: false }
    );
    if (error) return res.status(422).send(error.details.map(d => d.message));

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        await mongoClient.connect();
        const db = mongoClient.db();

        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const newTransaction = {
            type: value.type,
            text: value.text.result,
            amount: value.amount,
            userId: session.userId,
            time: dayjs().locale("pt-br").format("DD/MM")
        }
        await db.collection("transactions").insertOne(newTransaction);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getTransactions(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        await mongoClient.connect();
        const db = mongoClient.db();

        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        res.send(await db
            .collection("transactions")
            .find({ userId: session.userId })
            .sort({ _id: -1 })
            .toArray());

    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}