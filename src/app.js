import express, { json } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { signup, signin } from "./controllers/auth.controller.js";
import Joi from "@hapi/joi";


const app = express();
app.use(cors());
app.use(json());
dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
} catch (err) {
    console.error(err.message);
}
export const db = mongoClient.db();


export const userSchema = Joi.object({
    name: Joi.string().custom(value => stripHtml(value)).trim().required(),
    email: Joi.string().custom(value => stripHtml(value)).trim().email().required(),
    password: Joi.string().custom(value => stripHtml(value)).trim().min(3).required() // trim?
});


app.post("/sign-up", signup);
app.post("/sign-in", signin);

const PORT = 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));