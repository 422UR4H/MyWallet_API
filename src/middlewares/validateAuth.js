import { mongoClient } from "../database/database.connection.js";

export default async function validateAuth(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const dbSessions = (await mongoClient.connect()).db().collection("sessions");
        const session = await dbSessions.findOne({ token });

        if (!session) return res.sendStatus(401);
        
        res.locals.session = session;
        next();
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}