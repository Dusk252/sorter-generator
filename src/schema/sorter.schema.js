const Joi = require('joi');

// export const sorterDatabaseSchema = {
//     schema: Joi.object({
//         base_info: Joi.object({
//             name: Joi.string().max(50).required,
//             picture: Joi.string().required(),
//             tags: Joi.array().items(Joi.string()).required(),
//             description: Joi.string().max(1000),
//             privacy: Joi.string().max(30).required(),
//             creator_id: Joi.string().required(),
//             favorites: Joi.number().positive().integer().required(),
//             totalPlays: Joi.number().positive().integer().required()
//         }).required(),
//         extended_info: Joi.object({
//             groups: Joi.array()
//                 .items(
//                     Joi.object({
//                         name: Joi.string().max(50).required(),
//                         color: Joi.string().regex(/^#([A-Fa-f0-9]{3,4}){1,2}$/)
//                     })
//                 )
//                 .required(),
//             items: Joi.array()
//                 .items(
//                     Joi.object({
//                         name: Joi.string().max(50).required(),
//                         picture: Joi.any().meta({ swaggerType: 'file' }),
//                         group: Joi.number().positive().integer()
//                     })
//                 )
//                 .min(3)
//                 .required()
//         }).required()
//     })
// };

export const sorterFormSchema = {
    schema: Joi.object({
        name: Joi.string().max(50).messages({
            'any.required': 'The sorter needs to have a name.',
            'string.empty': 'The sorter needs to have a name.',
            'string.max': "The name's length can't be over 50 items."
        }),
        picture: Joi.alternatives()
            .try(
                Joi.any().meta({ swaggerType: 'file' }),
                Joi.string().regex(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
                Joi.string().regex(/^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w ]*.*))+$/),
                Joi.string().regex(/([^ !$`&*()+]|(\[ !$`&*()+]))+/)
            )
            .messages({
                'any.required': 'Please upload a logo or other representative picture.',
                'any.empty': 'Please upload a logo or other representative picture.'
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
                            Joi.any().meta({ swaggerType: 'file' }),
                            Joi.string().regex(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
                            Joi.string().regex(/^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w ]*.*))+$/),
                            Joi.string().regex(/([^ !$`&*()+]|(\[ !$`&*()+]))+/)
                        )
                        .messages({
                            'any.required': 'A item needs to have a picture.',
                            'any.empty': 'A item needs to have a picture.'
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
