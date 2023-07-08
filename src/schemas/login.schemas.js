import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const loginSchema = Joi.object({
    email: Joi.string().email().custom(value => stripHtml(value)).trim().required(),
    password: Joi.string().min(3).custom(value => stripHtml(value)).required()
});