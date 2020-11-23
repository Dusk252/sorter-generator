const Joi = require('joi');

export const sorterFormSchema = {
    schema: Joi.object({
        name: Joi.string().max(50).messages({
            'any.required': 'The sorter needs to have a name.',
            'string.empty': 'The sorter needs to have a name.',
            'string.max': "The name's length can't be over 50 items."
        }),
        picture: Joi.alternatives()
            .try(
                Joi.object().custom((value, helpers) => {
                    if (value instanceof File) return value;
                    else return helpers.error('any.invalid');
                }),
                Joi.string().uri(),
                Joi.string().regex(/^(?:[\w-_\.]+\/)*[\w-_\.]+\.(p?jpe?g|(x-)?png)$/)
            )
            .messages({
                'any.required': 'Please upload a logo or other representative picture.',
                'any.empty': 'Please upload a logo or other representative picture.',
                'string.empty': 'The main image must be either a valid url or an uploaded file.',
                'string.pattern.base': 'The main image must be either a valid url or an uploaded file.',
                'alternatives.match': 'The main image must be either a valid url or an uploaded file.'
            }),
        tags: Joi.array().items(Joi.string()),
        description: Joi.string().max(1000).messages({
            'string.max': 'The description field fits a max of 1000 items.'
        }),
        isPrivate: Joi.bool(),
        groups: Joi.array().items(
            Joi.object({
                name: Joi.string().max(50).required().messages({
                    'any.required': 'The group needs to have a name.',
                    'string.empty': 'The group needs to have a name.',
                    'string.max': "The group name's length can't be over 50 items."
                }),
                color: Joi.string()
                    .regex(/^#([A-Fa-f0-9]{3,4}){1,2}$/)
                    .messages({
                        'string.regex': 'The group needs to have a valid color.'
                    })
            })
        ),
        items: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().max(50).required().messages({
                        'any.required': 'A item needs to have a name.',
                        'string.empty': 'A item needs to have a name.',
                        'string.max': "The name's length can't be over 50 items."
                    }),
                    picture: Joi.alternatives()
                        .try(
                            Joi.object().custom((value, helpers) => {
                                if (value instanceof File) return value;
                                else return helpers.error('any.invalid');
                            }),
                            Joi.string().uri(),
                            Joi.string().regex(/^(?:[\w-_\.]+\/)*[\w-_\.]+\.(p?jpe?g|(x-)?png)$/)
                        )
                        .allow('')
                        .optional()
                        .messages({
                            'alternatives.match': 'The image field will only take a valid url or an uploaded file.'
                        }),
                    group: Joi.when(Joi.ref('$groupLen'), {
                        is: Joi.exist(),
                        then: Joi.number().positive().integer().allow(0).less(Joi.ref('$groupLen')),
                        otherwise: Joi.number().positive().integer().allow(0)
                    }).optional()
                })
            )
            .min(3)
            .messages({
                'any.required': "You can't have a sorter without items!",
                'array.empty': "You can't have a sorter without items!",
                'array.min': 'The sorter needs to have at least 3 items.'
            })
    }),
    requiredFields: ['name', 'picture', 'items']
};
