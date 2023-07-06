import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const transactionSchema = Joi.object({
    type: Joi.string().custom(v => stripHtml(v)).trim().valid("entrada", "saida").required(),
    text: Joi.string().custom(v => stripHtml(v)).trim().required(),
    amount: Joi.number().precision(2).required()
});