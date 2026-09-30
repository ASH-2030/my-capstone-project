# Project rules (Claude / Cursor)

This file captures rules learned from the settings-form workflow drill. They are meant to fail a review if broken.

1. **Validate before write.** `saveSettings` may write `config.json` only after `settingsSchema.js` (Joi) accepts the object. Invalid payloads return `{ success: false, errors }` and must leave the file unchanged.

2. **Closed settings shape.** The persisted document is exactly `{ name, email, theme, notifications }`. Name is 2–80 characters after trim. Email is a real address, stored lowercase. Theme is `light`, `dark`, or `system`. Notifications is a boolean (do not coerce arbitrary strings with `Boolean()`). Extra keys are an error.

3. **No demo overwrite.** `src/index.js` is the app entry point, not a scratchpad. It must not hardcode users (for example `John` / `john@example.com`) or rewrite settings on every `npm start`. Missing or invalid settings open the CLI form; valid settings print a welcome and the stored values.

4. **UTF-8 source.** JavaScript source is UTF-8. UTF-16 output from Windows editors or tools is a defect because Node will throw a SyntaxError.

5. **Tests are the verification step.** Schema or persistence changes ship with `node:test` files under `/tests` using a temp `SETTINGS` path. A session is not finished until `npm test` is run.
