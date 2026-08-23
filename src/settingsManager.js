// Lazy, vague approach - no validation library, hacky error handling
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

function loadSettings() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function saveSettings(settings) {
  if (!settings.name || !settings.email) {
    console.log('Missing fields');
    return false;
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(settings, null, 2));
  return true;
}

function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
}

module.exports = { loadSettings, saveSettings, updateSetting };