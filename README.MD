# get-express-starter

A powerful, customizable CLI that scaffolds full-featured Express.js boilerplates with **TypeScript** or **JavaScript** — production-ready from day one.

## Key Features

- ✅ Choose between **TypeScript** or **JavaScript**
- ✅ Select your database: **MongoDB** or **PostgreSQL**
- ✅ **JWT-based Authentication** (login, register, logout)
- ✅ **Email workflows**: Verify email, Forgot/Reset password
- ✅ **Role-based Access Control** (RBAC)
- ✅ Centralized **User Management System**
- ✅ **Joi-based Request Validation**
- ✅ Built-in **Pagination Utilities**
- ✅ **Security Best Practices** (Helmet, CORS, sanitization)
- ✅ **Versioned API Routes**
- ✅ **Winston Logging** for errors & requests
- ✅ **Centralized Config & ENV management**
- ✅ **Plop.js-based Code Generator** (like NestJS CLI, but unopinionated!)
- ✅ **Docker-Ready Setup** with `docker compose`
- ✅ Dev-friendly tooling: **Biome / ESLint + Prettier**, **Husky**, **lint-staged**
- ✅ Supports **ESM** or **CommonJS** in JavaScript mode
- ✅ **Customizable Templates** for rapid feature/module generation

---

## Installation

```bash
npm install -g get-express-starter

```

## Usage

```bash
get-express-starter
```

You'll be prompted to choose:

- Project name

- Language (TypeScript / JavaScript)

- Database (MongoDB / PostgreSQL)

- Code generator setup

## Example

```bash
$ get-express-starter
✔ Project name: my-api
✔ Language: TypeScript
✔ Database: PostgreSQL

➡️ cd my-api
➡️ pnpm install
➡️ cp .env.example .env 
➡️ pnpm run dev
```

## Project Templates

Depending on your choices, one of the following templates will be scaffolded:

- Express + MongoDB + TypeScript

- Express + PostgreSQL + TypeScript

- Express + MongoDB + JavaScript

## Code Generators

You’ll get built-in support for generating:

- Modules (routes, controllers, services)

- Models

- Middlewares

- Validators

- Utilities

```bash
pnpm generate

```

## Docker Support

Each project comes with:

- Dockerfile

- docker-compose.yml

Start your app via Docker:

```bash
docker compose up --build
```

## Linting & Formatting

You get a preconfigured dev experience:

- Biome (or ESLint + Prettier)

- Husky + lint-staged (pre-commit hooks)

Script examples:

```bash
pnpm lint      # Biome or ESLint
pnpm format    # Prettier or Biome
```
