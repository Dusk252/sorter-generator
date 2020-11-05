const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

export const sorterResultsSchema = {
    schema: Joi.object({
        sorter_id: Joi.objectId(),
        sorter_version_id: Joi.objectId(),
        results: Joi.array().items(Joi.number()),
        ties: Joi.object()
    }),
    requiredFields: ['sorter_id', 'sorter_version_id', 'results', 'ties']
};
