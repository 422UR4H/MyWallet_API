import { Router } from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import transactionRouter from "./transaction.routes.js";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(transactionRouter);

export default router;