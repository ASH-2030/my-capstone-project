const Joi = require('joi');

const VALID_THEMES = ['light', 'dark', 'system'];

const settingsSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().lowercase().required(),
  theme: Joi.string()
    .valid(...VALID_THEMES)
    .required(),
  notifications: Joi.boolean().required(),
})
  .unknown(false)
  .required();

const DEFAULT_SETTINGS = {
  name: '',
  email: '',
  theme: 'light',
  notifications: true,
};

function validateSettings(settings) {
  const { error, value } = settingsSchema.validate(settings, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return {
      valid: false,
      errors: error.details.map((detail) => detail.message),
      settings: null,
    };
  }

  return { valid: true, errors: [], settings: value };
}

module.exports = {
  settingsSchema,
  validateSettings,
  DEFAULT_SETTINGS,
  VALID_THEMES,
};
