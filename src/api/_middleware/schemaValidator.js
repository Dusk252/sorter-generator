module.exports = schemaValidator;

const Joi = require('joi');

const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
};

const CustomError = {
    Message: 'Invalid request data. Please review request and try again.'
};

function schemaValidator(schemaObj = null) {
    //check if our schema is a valid Joi schema
    if (!(schemaObj.schema instanceof Joi.constructor)) {
        throw new TypeError('No valid schema provided.');
    } else {
        const schema = schemaObj.schema.fork(schemaObj.requiredFields, (field) => field.required());
        return [
            // validate request
            (req, res, next) => {
                const { error, value } = schema.validate(req.body, validationOptions);
                if (error) {
                    res.status(422).json(CustomError);
                } else {
                    // replace req.body with the data after Joi validation
                    req.body = value;
                    next();
                }
            }
        ];
    }
}
