# WORKFLOW.md — Vague prompt vs specified prompt

This drill rebuilt one feature twice: a settings form with validation. Round one used a single lazy sentence and accepted the first output. Round two used a written spec, file constraints, example behavior, and a required test run. The two branches are `round-1-vague` and `round-2-precise`, both cut from the same `main` commit so the diff is two independent implementations, not a stacked rewrite.

## Round one (vague)

Prompt used: “build a setting form for my app.” No files named, no fields listed, no tests. The model produced `src/settingsManager.js` and a rewritten `src/index.js`. There is no form. `npm start` loads config, then immediately `saveSettings` with hardcoded `John` / `john@example.com` / `theme: 'dark'`, then flips theme to `light`. That is a demo script, not an app.

`saveSettings` only checks that `name` and `email` are truthy, then writes JSON. Invalid emails such as `not-an-email` persist. Extra keys persist. `updateSetting` mutates memory and calls the same weak save. Missing files return `{}` with no defaults. There are no tests and no `npm test` script. Review was short because there was almost nothing to review except “does it print.” It runs, but it overwrites the user’s file on every start.

**AI mistake caught:** `src/index.js` on `round-1-vague` is UTF-16 (wide characters in `git show`). Node expects UTF-8; that encoding is a SyntaxError waiting to happen and would have been missed without opening the file as bytes. A second mistake: treating the entry point as a scratchpad that seeds demo data, which is destructive once a real `config.json` exists.

## Round two (specified)

The spec named `src/settingsSchema.js`, `src/settingsManager.js`, `src/settingsForm.js`, `src/index.js`, and `tests/`. Constraints: Joi only, never write on failure, closed field set, temp-file tests, UTF-8, no hardcoded users. Example: trim `"  Alishba  "`, lowercase email, reject `theme: "neon"`. Verification: implement, then `npm test`, then `npm start` against a valid temp config.

Round two adds a real CLI form (Enter keeps the current value; invalid theme/email re-prompts), Joi in `settingsSchema.js`, `SETTINGS_PATH` / injected paths so tests never touch the real config, and `config.json` in `.gitignore`. `hasCompleteSettings` decides first-run vs welcome. Extra keys fail closed. `notifications: "yes"` is not saved via `Boolean()`.

## Diffs that matter

- `index.js`: demo writes vs form-or-welcome control flow.
- Validation: two truthy fields vs Joi schema with `unknown(false)`.
- Tests: absent vs `tests/settingsManager.test.js` and helper tests.
- Persistence: always-on John overwrite vs write-only-after-validate.
- Encoding: UTF-16 entry vs UTF-8.

Correctness is the largest gap. Accessibility for a CLI means labeled prompts, allowed values in the question, and retry text; round one has none of that. Edge cases (missing file, corrupt JSON, short name, extra keys) are explicit in round two tests.

## Review effort and time

Round one felt faster to generate (~minutes) and slower to trust: I had to inspect encoding, notice the John overwrite, and still had no regression net. Round two took longer to prompt and implement, but `npm test` made review cheaper. End-to-end, specified-plus-tests was faster than “accept output then debug encoding and data loss.” That is the lesson for FE-06 onward: vague generation is not a skill; a spec, constraints, and a verification loop are.
