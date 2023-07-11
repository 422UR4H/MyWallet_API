import { stripHtml } from "string-strip-html";

export default function validateIdParam(req, res, next) {
    res.locals.paramId = stripHtml(req.params.id).result;
    next();
}