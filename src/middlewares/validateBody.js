export default function validateBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) return res.status(422).send(error.details.map(d => d.message));

        res.locals.bodyValues = value;
        next();
    };
}