export default function validateTypeParam(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, { abortEarly: false });

        if (error) return res.status(422).send(error.details.map(d => d.message));

        res.locals.paramValue = value;
        next();
    };
}