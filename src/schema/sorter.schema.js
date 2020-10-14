const Joi = require('joi');

export const sorterFormSchema = {
    schema: Joi.object({
        picture: Joi.any().meta({ swaggerType: 'file' }).messages({
            'any.required': 'Please upload a logo or other representative picture.',
            'any.empty': 'Please upload a logo or other representative picture.'
        }),
        title: Joi.string().max(50).messages({
            'any.required': 'The sorter needs to have a title.',
            'string.empty': 'The sorter needs to have a title.',
            'string.max': "The title's length can't be over 50 characters."
        }),
        tags: Joi.array().items(Joi.string()),
        description: Joi.string().max(1000).messages({
            'string.max': 'The description field fits a max of 1000 characters.'
        }),
        isPrivate: Joi.bool(),
        groups: Joi.array().items(
            Joi.object({
                name: Joi.string().max(50).required().messages({
                    'any.required': 'The group needs to have a title.',
                    'string.empty': 'The group needs to have a title.',
                    'string.max': "The group title's length can't be over 50 characters."
                }),
                color: Joi.string()
                    .regex(/^#([A-Fa-f0-9]{3,4}){1,2}$/)
                    .messages({
                        'string.regex': 'The group needs to have a valid color.'
                    })
            })
        ),
        characters: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().max(50).required().messages({
                        'any.required': 'A character needs to have a name.',
                        'string.empty': 'A character needs to have a name.',
                        'string.max': "The name's length can't be over 50 characters."
                    }),
                    picture: Joi.string().messages({
                        'any.required': 'A character needs to have a picture.',
                        'string.empty': 'A character needs to have a picture.'
                    }),
                    group: Joi.any()
                })
            )
            //.min(3)
            .messages({
                'any.required': "You can't have a sorter without characters!",
                'array.empty': "You can't have a sorter without characters!",
                'array.min': 'The sorter needs to have at least 3 characters.'
            })
    }),
    requiredFields: ['title', 'picture', 'characters']
};

export const validateData = (object, schemaObj, requiredFields) => {
    if (!requiredFields || !requiredFields.length) requiredFields = schemaObj.requiredFields;
    else requiredFields = requiredFields.filter((field) => schemaObj.requiredFields.includes(field));
    const res = schemaObj.schema.fork(requiredFields, (field) => field.required()).validate(object, { abortEarly: false });

    if (!res.error) return { values: res.value, errors: null };
    else {
        const errorMap = {};
        res.error.details.forEach((err) => {
            if (errorMap[err.context.label]) errorMap[err.context.label].message.push(err.message);
            else errorMap[err.context.label] = { path: err.path, message: [err.message] };
        });
        return { values: res.value, errors: errorMap };
    }
};

//for localization at some point
// const buildUsefulErrorObject = (errors) => {
//     const usefulErrors = {};
//     errors.map((error) => {
//         if (!usefulErrors.hasOwnProperty(error.path.join('_'))) {
//             usefulErrors[error.path.join('_')] = {
//                 type: error.type,
//                 msg: `error.${error.path.join('_')}.${error.type}`
//             };
//         }
//     });
//     return usefulErrors;
// };
