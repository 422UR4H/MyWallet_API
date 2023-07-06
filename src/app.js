import express, { json } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { getUser } from "./controllers/user.controller.js";
import { signup, signin, signout } from "./controllers/auth.controller.js";
import { postTransaction, getTransactions } from "./controllers/transaction.controller.js";


const app = express();
app.use(cors());
app.use(json());
dotenv.config();


export const mongoClient = new MongoClient(process.env.DATABASE_URL);
// try {
//     await mongoClient.connect();
// } catch (err) {
//     console.error(err.message);
// }
// export const db = mongoClient.db();


app.post("/sign-up", signup);
app.post("/sign-in", signin);
app.post("/sign-out", signout);
app.post("/transaction/:type", postTransaction);
app.get("/transactions", getTransactions);
app.get("/user", getUser);

const PORT = 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));