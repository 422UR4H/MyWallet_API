import dayjs from "dayjs";
import { mongoClient } from "../database/database.connection.js";
import { ObjectId } from "mongodb";


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
        const dbTrans = (await mongoClient.connect()).db().collection("transactions");
        const transaction = await dbTrans.findOne({ _id: new ObjectId(transId) });

        if (!transaction) return res.sendStatus(404);
        if (transaction.userId.toString() !== userId.toString()) {
            return res.sendStatus(401)
        };
        const result = await dbTrans.deleteOne({ _id: new ObjectId(transId) });
        console.log("aquiii")

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}