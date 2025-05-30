# get-express-starter

🚀 A simple CLI to generate Express.js boilerplates with TypeScript or JavaScript — batteries included.

## Features

- ✅ TypeScript & JavaScript support
- ✅ MongoDB & PostgreSQL support
- ✅ Fully modular boilerplates (auth, user, utils, etc.)
- ✅ JWT authentication with protected routes
- ✅ Robust request validation with Joi
- ✅ Email verification & password reset workflows
- ✅ Pagination utility included
- ✅ Dockerized with ready-to-use `docker-compose`
- ✅ ESM or CommonJS support for JavaScript
- ✅ ESLint + Prettier / Biome, Husky, and lint-staged pre-configured
- ✅ Easy prompts for clean setup
- ✅ Custom code snippets included
- ✅ Production-ready templates with `env` support

## Installation

```bash
npm install -g get-express-starter
```

## Usage

```bash
get-express-starter
```

## Example

```bash
$ get-express-starter
✔ Project name: my-api
✔ Language: TypeScript
✔ Database: PostgreSQL

➡️ cd my-api
➡️ pnpm install
➡️ pnpm dev
```

## Templates

Templates
Your project will be generated using boilerplate templates located internally:

- Express + MongoDB + TypeScript

- Express + PostgreSQL + TypeScript

- Express + MongoDB + JavaScript
