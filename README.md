# React + TypeScript + Vite

## 🚀 Local Development

The project is structured as a monorepo containing two fully isolated applications. You can run them both easily using root scripts, or run them entirely separately.

### Prerequisites
- **Node.js** (v18+)
- **NPM** (v9+)
- **Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

---

### Method 1: Running the Full Stack (Convenience)

From the root directory:
```bash
# 1. Start the backend in one terminal
npm run backend

# 2. Start the frontend in another terminal
npm run frontend
```

---

### Method 2: Running Independently (For deployment prep)

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Set VITE_API_URL=http://localhost:3000 if running locally
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment

Because the `frontend` and `backend` are isolated projects with their own `package.json`, they can be easily deployed to independent hosting providers.

* **Frontend**: Deploy the `frontend/` directory to Vercel, Netlify, or Cloudflare Pages.
  * Build command: `npm run build`
  * Output directory: `dist`
  * Environment Variables: Configure `VITE_API_URL` to point to your deployed backend.

* **Backend**: Deploy the `backend/` directory to Render, Railway, or Heroku.
  * Build command: `npm run build`
  * Start command: `npm start`
  * Environment Variables: Configure `GEMINI_API_KEY`, `CORS_ORIGIN` (pointing to your deployed frontend), and set `NODE_ENV=production`.

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
