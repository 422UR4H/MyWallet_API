import dayjs from "dayjs";
import { mongoClient } from "../database/database.connection.js";


export async function postTransaction(req, res) {
    const { bodyValues, paramValue } = res.locals;
    const text = bodyValues.text.result;
    const { type } = paramValue;
    const { amount } = bodyValues;
    const { userId } = res.locals.session;

    try {
        const db = (await mongoClient.connect()).db();
        const time = dayjs().locale("pt-br").format("DD/MM");

        await db.collection("transactions").insertOne(
            { type, text, amount, time, userId }
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getTransactions(req, res) {
    try {
        const dbTrans = (await mongoClient.connect()).db().collection("transactions");
        res.send(await dbTrans
            .find({ userId: res.locals.session.userId })
            .sort({ _id: -1 })
            .toArray());

    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function deleteTransaction(req, res) {
    const { userId } = res.locals.session;
    const transId = res.locals.paramId;
    console.log(`userId: ${userId}, transId: ${transId}`);

    try {
        const db = (await mongoClient.connect()).db();
        const transaction = await db.collection("transactions").findOne({ _id: transId });

        if (!transaction) return res.sendStatus(404);
        if (transaction.userId !== userId) return res.sendStatus(401);

        await db.collection("transactions").deleteOne({ _id: transId });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

app.delete("/messages/:id", async (req, res) => {
    const name = req.headers.user;
    const id = stripHtml(req.params.id).result;

    try {
        const message = await db.collection("messages").findOne({ _id: new ObjectId(id) });
        if (!message) return res.sendStatus(404);
        if (name !== message.from) return res.sendStatus(401);

        await db.collection("messages").deleteOne({ _id: new ObjectId(id) });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
});