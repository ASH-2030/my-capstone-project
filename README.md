# My Capstone Project

## Description

This is my AI-assisted development capstone project. It will demonstrate modern JavaScript development practices with AI pair programming.

This branch (`round-2-precise`) includes a CLI settings form with Joi validation and automated tests. See [WORKFLOW.md](WORKFLOW.md) for the round-one vs round-two comparison.

## Tech Stack

- Node.js (LTS)
- JavaScript
- npm
- Joi (settings validation)

## Prerequisites

- [Node.js](https://nodejs.org/) 20 LTS or later
- npm (included with Node.js)

Verify your setup:

```bash
node --version
npm --version
```

## Getting Started

1. Clone the repository and open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm start
   ```

   First run prompts for name, email, theme, and notifications. Later runs print the saved settings.

4. Update settings later:

   ```bash
   npm run settings
   ```

5. Run tests:

   ```bash
   npm test
   ```

## Project Structure

```
my-capstone-project/
├── src/          # Application source code
├── tests/        # Test files
├── docs/         # Documentation
├── WORKFLOW.md   # Round 1 vs Round 2 AI workflow write-up
└── package.json  # Project metadata and npm scripts
```

## License

This project is licensed under the [MIT License](LICENSE).
