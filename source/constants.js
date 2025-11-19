import { cronPlugin } from './plugins/cron.js';

export const AVAILABLE_PLUGINS = {
  cron: cronPlugin,
  // Add future plugins here: 'socket': socketPlugin, etc.
};

export const TEMPLATE_MAP = {
  'javascript-mongo': 'https://github.com/logicalHassan/node-express-boilerplate.git',
  'typescript-mongo': 'https://github.com/logicalHassan/nodets-express-boilerplate.git',
  'typescript-prisma': 'https://github.com/logicalHassan/express-postgres-prisma.git',
  'typescript-drizzle': 'https://github.com/logicalHassan/express-postgres-drizzle.git',
};

export const DEFAULT_PACKAGE_MANAGER = 'pnpm';
