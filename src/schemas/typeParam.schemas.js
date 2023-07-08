import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const typeParamSchema = Joi.object({
    type: Joi.string().custom(v => stripHtml(v)).trim().valid("entrada", "saida").required()
});