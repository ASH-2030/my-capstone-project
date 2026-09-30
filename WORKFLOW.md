# WORKFLOW.md — Vague prompt vs specified prompt

This drill rebuilt one feature twice: a settings form with validation. Round one used a single lazy sentence and accepted the first output. Round two used a written spec, file constraints, example behavior, and a required test run. Branches `round-1-vague` and `round-2-precise` both start from the same `main` commit, so the diff is two independent implementations, not a stacked rewrite.

## Round one (vague)

Prompt used: “build a setting form for my app.” No files named, no fields listed, no tests. The model produced `src/settingsManager.js` and a rewritten `src/index.js`. There is no form. `npm start` loads config, then `saveSettings` with hardcoded `John` / `john@example.com` / `theme: 'dark'`, then flips theme to `light`. That is a demo script, not an app.

`saveSettings` only checks that `name` and `email` are truthy, then writes JSON. Invalid emails such as `not-an-email` persist. Extra keys persist. Missing files return `{}` with no defaults. There are no tests. Review was “does it print,” but it overwrites the user’s file on every start.

**AI mistake caught:** the first `round-1-vague` commit saved `src/index.js` as UTF-16. Node expects UTF-8 and threw `SyntaxError: Invalid or unexpected token`. A follow-up commit only re-saved the same John script as UTF-8 so the branch runs; the lazy logic was not improved. A second mistake: using the entry point as a scratchpad that seeds demo data.

## Round two (specified)

The spec named `src/settingsSchema.js`, `src/settingsManager.js`, `src/settingsForm.js`, `src/index.js`, and `tests/`. Constraints: Joi only, never write on failure, closed field set, temp-file tests, UTF-8, no hardcoded users. Example: trim `"  Alishba  "`, lowercase email, reject `theme: "neon"`. Verification: implement, then `npm test`, then `npm start` against a valid temp config.

Round two adds a CLI form (Enter keeps the current value; invalid theme/email re-prompts), Joi, injected paths so tests never touch real `config.json`, and `config.json` in `.gitignore`. Extra keys fail closed. `notifications: "yes"` is not saved via `Boolean()`.

## Diffs that matter

- `index.js`: demo writes vs form-or-welcome control flow.
- Validation: two truthy fields vs Joi with `unknown(false)`.
- Tests: none vs `tests/settingsManager.test.js` and helper tests.
- Persistence: John overwrite vs write-only-after-validate.
- Encoding: UTF-16 entry vs UTF-8.

Correctness is the largest gap. CLI accessibility here means labeled prompts, allowed values in the question, and retry text; round one has none. Edge cases (missing file, corrupt JSON, short name, extra keys) are in round two tests.

## Review effort and time

Round one felt faster to generate and slower to trust: encoding, the John overwrite, and no regression net. Round two took longer to prompt, but `npm test` made review cheaper. End-to-end, specified-plus-tests was faster than accepting output and then debugging encoding and data loss. That is the lesson for later assignments: directing AI with specs and verification is the skill, not “used AI to build it.”
