import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";


export const userSchema = Joi.object({
    name: Joi.string().custom(value => stripHtml(value)).trim().required(),
    email: Joi.string().email().custom(value => stripHtml(value)).trim().required(),
    password: Joi.string().min(3).custom(value => stripHtml(value)).trim().required() // trim?
});

export const loginSchema = Joi.object({
    email: Joi.string().email().custom(value => stripHtml(value)).trim().required(),
    password: Joi.string().min(3).custom(value => stripHtml(value)).trim().required() // trim?
});

export const transactionSchema = Joi.object({
    type: Joi.string().custom(v => stripHtml(v)).trim().valid("entrada", "saida").required(),
    text: Joi.string().custom(v => stripHtml(v)).trim().required(),
    amount: Joi.number().precision(2).required()
});