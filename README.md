# get-express-starter

**The last Express.js boilerplate you'll ever need.**

A powerful, customizable CLI that scaffolds production-ready Express.js applications. Whether you prefer **TypeScript or JavaScript**, **MongoDB or PostgreSQL**, `get-express-starter` sets up a scalable architecture with best practices from day one.

---

## Key Features

- ✅ Choose between **TypeScript** or **JavaScript**
- ✅ Select your database: **MongoDB** or **PostgreSQL**
- ✅ **JWT-based Authentication** (login, register, logout)
- ✅ **Email workflows**: Verify email, Forgot/Reset password
- ✅ **Role-based Access Control** (RBAC)
- ✅ Centralized **User Management System**
- ✅ **Zod-based Request Validation**
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
➡️ pnpm run dev
➡️ pnpm generate // For code generators
```

## Project Templates

Depending on your choices, one of the following templates will be scaffolded:

- Express + MongoDB + TypeScript

- Express + PostgreSQL + TypeScript (Prisma)

- Express + PostgreSQL + TypeScript (Drizzle)

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

## Developer Productivity (DX)

We include tools to make your daily coding faster.

### 1. Code Generators (Plop.js)

Don't copy-paste files to create a new API resource. Use the generator:

```bash
pnpm generate
```

It will ask what you want to create (Controller, Route, Service, Model) and generate the boilerplate code for you.

### 2. VS Code Snippets

Inside the `.vscode` folder of your generated project, we include custom snippets. Just start typing the prefix, and VS Code will handle the rest.

#### Example: Creating a Controller

Type `exctrl` and hit `TAB`:

```bash
// You type: exctrl

// It expands to:
const myController: RequestHandler = async (req, res) => {
  // Cursor lands here ready to code!
};

```

## The Plugin System (New!)

Introducing plugins: instead of bloating the base templates, you can choose plugins to add powerful features to your starter project. Even if you forget to add a feature during setup, no problem—you can inject plugins into your existing project at any time.

The CLI intelligently analyzes your project structure (detecting TS vs JS) and injects code safely.

### **Command**

```bash
npx get-express-starter add <plugin-name>

```

### Available Plugins

| Plugin     | Command    | Description                                                             |
|------------|------------|-------------------------------------------------------------------------|
| Cron Jobs  | `add cron` | Adds node-cron setup, scheduled task architecture, and example jobs.   |

### Plugin Example

```bash
cd my-super-api
npx get-express-starter add cron

```

This will install dependencies, create a src/jobs directory, and inject initialization code into your server entry point automatically.

#### This project is licensed under the [MIT License](LICENSE) © 2025 Muhammad Hassan
