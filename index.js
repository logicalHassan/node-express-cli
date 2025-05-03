#!/usr/bin/env node

import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const TEMPLATE_MAP = {
  'javascript-mongo': 'node-express-boilerplate',
  'typescript-mongo': 'nodets-express-boilerplate',
  'typescript-postgres': 'express-postgres-prisma',
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
      { title: 'TypeScript (recommended)', value: 'typescript' },
      { title: 'JavaScript', value: 'javascript' },
    ],
  });

  let templateKey = '';

  if (language === 'typescript') {
    const { database } = await prompts({
      type: 'select',
      name: 'database',
      message: 'Select a database:',
      choices: [
        { title: 'MongoDB', value: 'mongo' },
        { title: 'PostgreSQL', value: 'postgres' },
      ],
    });

    templateKey = `typescript-${database}`;
  } else {
    // Default to Mongo for JavaScript
    templateKey = 'javascript-mongo';
  }

  if (!TEMPLATE_MAP[templateKey]) {
    log(chalk.red(`❌ Template for "${templateKey}" is not supported.`));
    return;
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
