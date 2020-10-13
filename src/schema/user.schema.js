import Joi from 'joi';

const user = Joi.object({
    username: Joi.string()
});
