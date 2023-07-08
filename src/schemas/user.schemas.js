import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const userSchema = Joi.object({
    name: Joi.string().custom(value => stripHtml(value)).trim().required(),
    email: Joi.string().email().custom(value => stripHtml(value)).trim().required(),
    password: Joi.string().min(3).custom(value => stripHtml(value)).required()
});