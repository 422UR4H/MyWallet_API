import express, { json } from "express";
import router from "./routers/index.routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running on port ${port}`));