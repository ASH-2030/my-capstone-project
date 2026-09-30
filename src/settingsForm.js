const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const { loadSettings, saveSettings } = require('./settingsManager');
const { VALID_THEMES } = require('./settingsSchema');

function formatDefault(value) {
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }
  return String(value);
}

function parseBoolean(value) {
  const normalized = String(value).trim().toLowerCase();
  if (['y', 'yes', 'true', '1'].includes(normalized)) {
    return true;
  }
  if (['n', 'no', 'false', '0'].includes(normalized)) {
    return false;
  }
  return null;
}

async function promptUntilValid(rl, label, currentValue, parseFn) {
  const answer = await rl.question(`${label} [${formatDefault(currentValue)}]: `);
  const nextValue = answer.trim() === '' ? currentValue : parseFn(answer);
  return nextValue;
}

async function promptName(rl, currentName) {
  const name = await promptUntilValid(rl, 'Name (2-80 characters)', currentName, (raw) =>
    raw.trim()
  );
  if (!name || name.length < 2 || name.length > 80) {
    console.log('Name must be between 2 and 80 characters.');
    return promptName(rl, currentName);
  }
  return name;
}

async function promptEmail(rl, currentEmail) {
  const email = await promptUntilValid(rl, 'Email', currentEmail, (raw) => raw.trim());
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log('Enter a valid email address, for example alex@example.com.');
    return promptEmail(rl, currentEmail);
  }
  return email;
}

async function promptTheme(rl, currentTheme) {
  const themeList = VALID_THEMES.join(', ');
  const theme = await promptUntilValid(
    rl,
    `Theme (${themeList})`,
    currentTheme,
    (raw) => raw.trim().toLowerCase()
  );
  if (!VALID_THEMES.includes(theme)) {
    console.log(`Theme must be one of: ${themeList}.`);
    return promptTheme(rl, currentTheme);
  }
  return theme;
}

async function promptNotifications(rl, currentValue) {
  const answer = await rl.question(
    `Enable notifications? yes/no [${formatDefault(currentValue)}]: `
  );
  if (answer.trim() === '') {
    return currentValue;
  }
  const parsed = parseBoolean(answer);
  if (parsed === null) {
    console.log('Please enter yes or no.');
    return promptNotifications(rl, currentValue);
  }
  return parsed;
}

async function runSettingsForm(configPath) {
  const rl = readline.createInterface({ input, output });
  const current = loadSettings(configPath);

  console.log('\n=== App Settings ===\n');
  console.log('Press Enter to keep the current value.\n');

  try {
    const name = await promptName(rl, current.name);
    const email = await promptEmail(rl, current.email);
    const theme = await promptTheme(rl, current.theme);
    const notifications = await promptNotifications(rl, current.notifications);

    const result = saveSettings({ name, email, theme, notifications }, configPath);

    if (!result.success) {
      console.log('\nCould not save settings:');
      result.errors.forEach((error) => console.log(`  - ${error}`));
      process.exitCode = 1;
      return result;
    }

    console.log('\nSettings saved successfully:');
    console.log(JSON.stringify(result.settings, null, 2));
    return result;
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  runSettingsForm().catch((error) => {
    console.error('Settings form failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  runSettingsForm,
  parseBoolean,
  formatDefault,
};
