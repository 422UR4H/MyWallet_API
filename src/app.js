import express, { json } from "express";
import cors from "cors";
import { getUser } from "./controllers/user.controller.js";
import { signup, signin, signout } from "./controllers/auth.controller.js";
import { postTransaction, getTransactions } from "./controllers/transaction.controller.js";

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", signup);
app.post("/sign-in", signin);
app.post("/sign-out", signout);
app.post("/transaction/:type", postTransaction);
app.get("/transactions", getTransactions);
app.get("/user", getUser);

const PORT = 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));