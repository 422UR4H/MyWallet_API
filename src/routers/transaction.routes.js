import { Router } from "express";
import { getTransactions, postTransaction } from "../controllers/transaction.controller.js";
import { transactionSchema } from "../schemas/transaction.schemas.js";
import { typeParamSchema } from "../schemas/typeParam.schemas.js";
import validateTypeParam from "../middlewares/validateTypeParam.js";
import validateBody from "../middlewares/validateBody.js";

const router = Router();

router.post("/transaction/:type", validateBody(transactionSchema), validateTypeParam(typeParamSchema), postTransaction);
router.get("/transactions", getTransactions);

export default router;