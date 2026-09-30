const fs = require('fs');
const path = require('path');
const {
  validateSettings,
  DEFAULT_SETTINGS,
} = require('./settingsSchema');

function resolveConfigPath(configPath) {
  return configPath || process.env.SETTINGS_PATH || path.join(__dirname, '..', 'config.json');
}

function loadSettings(configPath) {
  const filePath = resolveConfigPath(configPath);

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    const result = validateSettings({ ...DEFAULT_SETTINGS, ...parsed });
    if (result.valid) {
      return result.settings;
    }
    return { ...DEFAULT_SETTINGS };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { ...DEFAULT_SETTINGS };
    }
    if (error instanceof SyntaxError) {
      return { ...DEFAULT_SETTINGS };
    }
    throw error;
  }
}

function saveSettings(settings, configPath) {
  const result = validateSettings(settings);
  if (!result.valid) {
    return { success: false, errors: result.errors };
  }

  const filePath = resolveConfigPath(configPath);
  fs.writeFileSync(filePath, `${JSON.stringify(result.settings, null, 2)}\n`, 'utf8');
  return { success: true, settings: result.settings };
}

function updateSetting(key, value, configPath) {
  const settings = loadSettings(configPath);
  settings[key] = value;
  return saveSettings(settings, configPath);
}

function hasCompleteSettings(settings) {
  const result = validateSettings(settings);
  return result.valid;
}

module.exports = {
  loadSettings,
  saveSettings,
  updateSetting,
  hasCompleteSettings,
  resolveConfigPath,
};
