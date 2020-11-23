const Joi = require('joi');

export const sorterResultsSchema = {
    schema: Joi.object({
        sorter_id: Joi.string()
            .min(11)
            .max(11)
            .regex(/^[A-Za-z0-9_-]*$/),
        sorter_version_id: Joi.string()
            .min(11)
            .max(11)
            .regex(/^[A-Za-z0-9_-]*$/),
        results: Joi.array().items(Joi.number()),
        ties: Joi.object()
    }),
    requiredFields: ['sorter_id', 'sorter_version_id', 'results', 'ties']
};
