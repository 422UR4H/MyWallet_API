import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const transactionSchema = Joi.object({
    text: Joi.string().custom(v => stripHtml(v)).trim().required(),
    amount: Joi.number().positive().precision(2).required()
});