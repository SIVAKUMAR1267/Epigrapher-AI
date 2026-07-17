# React + TypeScript + Vite

## Environment Setup

The application uses environment variables for secure configuration. Follow these steps to set up your local environment:

1. Copy the example configuration file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the required variables:
   - `GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio. This is required for AI transcription and analysis.
   - `PORT`: (Optional) The backend server port (defaults to 3001).
   - `VITE_API_URL`: (Optional) The frontend API base URL (defaults to http://localhost:3001).

3. Start the application:
   ```bash
   npm install
   npm run dev
   ```

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Configure your `.env` file as shown above
4. Run `npm run start` to start both the Vite frontend and Express backend concurrently.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
