import { Router } from "express";
import { deleteTransaction, getTransactions, postTransaction } from "../controllers/transaction.controller.js";
import { transactionSchema } from "../schemas/transaction.schemas.js";
import { typeParamSchema } from "../schemas/typeParam.schemas.js";
import validateTypeParam from "../middlewares/validateTypeParam.js";
import validateBody from "../middlewares/validateBody.js";
import validateIdParam from "../middlewares/validateIdParam.js";

const router = Router();

router.post("/transaction/:type", validateBody(transactionSchema), validateTypeParam(typeParamSchema), postTransaction);
router.get("/transactions", getTransactions);
router.delete("/transaction/:id", validateIdParam, deleteTransaction);

export default router;