const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseBoolean, formatDefault } = require('../src/settingsForm');

describe('settingsForm helpers', () => {
  it('parses yes/no aliases into booleans', () => {
    assert.equal(parseBoolean('yes'), true);
    assert.equal(parseBoolean('Y'), true);
    assert.equal(parseBoolean('no'), false);
    assert.equal(parseBoolean('0'), false);
    assert.equal(parseBoolean('maybe'), null);
  });

  it('formats boolean defaults as yes/no for the prompt label', () => {
    assert.equal(formatDefault(true), 'yes');
    assert.equal(formatDefault(false), 'no');
    assert.equal(formatDefault('dark'), 'dark');
  });
});
