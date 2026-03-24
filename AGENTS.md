# Repository Guidelines

## Project Structure & Module Organization
`src/index.js` boots the Express server and exposes `/health`. Route handlers live in `src/routes/`, config helpers in `src/config/`, and prompt text in `src/prompts/system.txt`. Tests are colocated with the code they cover as `*.test.js` files, for example `src/routes/chat.test.js`. GitHub Actions live in `.github/workflows/`.

## Build, Test, and Development Commands
Run `npm install` to install dependencies. Use `npm start` to launch the app with `.env`, or `npm run dev` for watch mode during local development. Run `npm test` to execute the full Node test suite and `npm run test:watch` while iterating on a change. CI also runs `npm test` on pushes to `main` and pull requests.

## Coding Style & Naming Conventions
This project uses ESM JavaScript (`"type": "module"`) on Node 24 in CI. Follow the existing style: 2-space indentation, single quotes, semicolons, `const` by default, and small focused modules. Use `camelCase` for variables and functions, and keep filenames lowercase with explicit `.js` imports, such as `./routes/chat.js`.

## Testing Guidelines
Tests use Node’s built-in runner from `node:test` with `node:assert`; no separate framework is configured. Add or update a nearby `*.test.js` file whenever behavior changes. Prefer descriptive `it('should ...')` names and cover request validation, environment-dependent behavior, and response shape for API routes.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style, for example `chore(deps): lock file maintenance (#35)`. Use `type(scope): imperative summary` where possible, such as `fix(chat): validate empty input`. Pull requests should explain the behavior change, link the relevant issue, note any `.env` or prompt updates, and include example request/response payloads when endpoint behavior changes.

## Security & Configuration Tips
Copy `.env.example` to `.env` and set `OPENAI_API_KEY` and `PORT` for local runs. Never commit real secrets. Because this repository is used for prompt-security exercises, treat changes to `src/prompts/system.txt` and `src/routes/chat.js` as security-sensitive and describe the expected impact in the PR.
