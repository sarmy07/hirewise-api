import joi from 'joi';

export const validation = joi.object({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().port().default(5432),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
});
