# Maslow Foundation Virtual Hub Chatbot

This project uses Next.js, TypeScript, [Tailwind CSS](https://tailwindcss.com/), and [shadcn UI](https://ui.shadcn.com/), and was created using [create-next-app](https://nextjs.org/docs/api-reference/create-next-app).

## Getting started

1. Install the dependencies by running `npm install` in a terminal from the root of the project.
2. Make a copy of the `.env.template` file and name it `.env.local`. Ensure it is in the root of the project.
3. Add values for each of the environment variables in `.env.local`. Note: Maslow Foundation - please see 'Environment variables' in the handover documentation for how to retrieve these.
4. Run the development server: `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note: If you are running a demo, use a production server (run `npm run build` followed by `npm run start`).**

## Available commands
- `npm run dev`: Starts the development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a Next.js production server.
- `npm run lint`: Runs ESLint on all files with the extensions `js`, `ts`, `jsx`, and `tsx`.
- `npm run lint:fix`: Attempts to automatically fix linting problems.
- `npm run lint:cache`: Only checks the changed files since the last run.
- `npm run format`: Formats all files inside the src directory based on the Prettier configuration.
- `npm run format:check`: Checks if the files inside the src directory are formatted according to the Prettier configuration.
- `npm run typecheck`: Compiles the project and checks for type errors.
- `npm run prepare`: Ensures that Husky is properly installed and configured.

## Known issues
- The pre-commit hook occassionally fails when a file is partially staged (i.e., if you stage a file with some changes, make some more changes but don't stage these, then go to commit the first set of changes).
