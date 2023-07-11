import { stripHtml } from "string-strip-html";

export default function validateIdParam(req, res, next) {
    console.log("in validateIdParam")
    res.locals.paramId = stripHtml(req.params.id).result;
    next();
}