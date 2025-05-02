#!/usr/bin/env node

import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const TEMPLATE_MAP = {
  'ts-mongo': 'mongo-ts',
  'ts-pg-prisma': 'pg-prisma',
  'ts-pg-drizzle': 'pg-drizzle',
  'js-cjs': 'js-cjs',
  'js-esm': 'js-esm',
};

const log = console.log;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  log(chalk.cyan.bold('\nWelcome to get-express-starter\n'));

  const { projectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: 'my-api-server',
  });

  const projectPath = join(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    log(chalk.red(`Folder "${projectName}" already exists. Please choose a different name.`));
    return;
  }

  const { language } = await prompts({
    type: 'select',
    name: 'language',
    message: 'Choose your language:',
    choices: [
      { title: 'TypeScript (recommended)', value: 'ts' },
      { title: 'JavaScript', value: 'js' },
    ],
  });

  let templateKey = '';

  if (language === 'ts') {
    const { database } = await prompts({
      type: 'select',
      name: 'database',
      message: 'Select a database:',
      choices: [
        { title: 'MongoDB', value: 'mongo' },
        { title: 'PostgreSQL', value: 'postgres' },
      ],
    });

    if (database === 'mongo') {
      templateKey = 'ts-mongo';
    } else {
      const { orm } = await prompts({
        type: 'select',
        name: 'orm',
        message: 'Choose an ORM:',
        choices: [
          { title: 'Prisma (recommended)', value: 'prisma' },
          { title: 'Drizzle', value: 'drizzle' },
        ],
      });
      templateKey = `ts-pg-${orm}`;
    }
  } else {
    const { moduleType } = await prompts({
      type: 'select',
      name: 'moduleType',
      message: 'Choose JS module system:',
      choices: [
        { title: 'CommonJS', value: 'cjs' },
        { title: 'ESM', value: 'esm' },
      ],
    });
    templateKey = `js-${moduleType}`;
  }

  const selectedTemplate = TEMPLATE_MAP[templateKey];
  const templatePath = join(__dirname, 'templates', selectedTemplate);

  try {
    log(chalk.yellow(`\nScaffolding project...`));
    await fs.copy(templatePath, projectPath);
    log(chalk.green(`✔ Project created in "${projectName}"`));

    log(chalk.blue(`\nNext steps:`));
    log(`   cd ${projectName}`);
    log(`   pnpm install`);
    log(`   pnpm dev\n`);

    log(chalk.green('✅ All set! Happy coding!\n'));
  } catch (err) {
    log(chalk.red('❌ Failed to scaffold project:'), err);
  }
}

main().catch((err) => {
  console.error(chalk.red('❌ Unexpected error:'), err);
});
