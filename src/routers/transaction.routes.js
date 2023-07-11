import { Router } from "express";
import { transactionSchema } from "../schemas/transaction.schemas.js";
import { typeParamSchema } from "../schemas/typeParam.schemas.js";
import validateTypeParam from "../middlewares/validateTypeParam.js";
import validateIdParam from "../middlewares/validateIdParam.js";
import validateBody from "../middlewares/validateBody.js";
import {
    deleteTransaction,
    editTransaction,
    getTransaction,
    getTransactions,
    postTransaction
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transaction/:type", validateBody(transactionSchema), validateTypeParam(typeParamSchema), postTransaction);
router.get("/transactions", getTransactions);
router.get("/transaction/:id", validateIdParam, getTransaction);
router.delete("/transaction/:id", validateIdParam, deleteTransaction);
router.put("/transaction/:id", validateBody(transactionSchema), validateTypeParam(typeParamSchema), validateIdParam, editTransaction);

export default router;