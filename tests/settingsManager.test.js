const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  loadSettings,
  saveSettings,
  updateSetting,
  hasCompleteSettings,
} = require('../src/settingsManager');
const { DEFAULT_SETTINGS } = require('../src/settingsSchema');

describe('settingsManager', () => {
  let tempDir;
  let configPath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'settings-'));
    configPath = path.join(tempDir, 'config.json');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns defaults when the config file is missing', () => {
    assert.deepEqual(loadSettings(configPath), DEFAULT_SETTINGS);
  });

  it('returns defaults when the config file is invalid JSON', () => {
    fs.writeFileSync(configPath, '{not-json', 'utf8');
    assert.deepEqual(loadSettings(configPath), DEFAULT_SETTINGS);
  });

  it('saves a valid settings object and reloads it', () => {
    const payload = {
      name: '  Alishba  ',
      email: 'Alishba@Example.COM',
      theme: 'dark',
      notifications: false,
    };

    const saved = saveSettings(payload, configPath);
    assert.equal(saved.success, true);
    assert.deepEqual(saved.settings, {
      name: 'Alishba',
      email: 'alishba@example.com',
      theme: 'dark',
      notifications: false,
    });
    assert.deepEqual(loadSettings(configPath), saved.settings);
  });

  it('does not write the file when validation fails', () => {
    const result = saveSettings(
      {
        name: 'A',
        email: 'not-an-email',
        theme: 'neon',
        notifications: 'yes',
      },
      configPath
    );

    assert.equal(result.success, false);
    assert.ok(result.errors.length >= 1);
    assert.equal(fs.existsSync(configPath), false);
  });

  it('rejects extra keys instead of persisting them', () => {
    const result = saveSettings(
      {
        name: 'Alishba',
        email: 'alishba@example.com',
        theme: 'light',
        notifications: true,
        admin: true,
      },
      configPath
    );

    assert.equal(result.success, false);
    assert.equal(fs.existsSync(configPath), false);
  });

  it('does not persist an invalid updateSetting change', () => {
    saveSettings(
      {
        name: 'Alishba',
        email: 'alishba@example.com',
        theme: 'light',
        notifications: true,
      },
      configPath
    );

    const result = updateSetting('email', 'bad-email', configPath);
    assert.equal(result.success, false);
    assert.equal(loadSettings(configPath).email, 'alishba@example.com');
  });

  it('treats incomplete defaults as not complete', () => {
    assert.equal(hasCompleteSettings(DEFAULT_SETTINGS), false);
  });
});
