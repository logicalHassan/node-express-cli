#!/usr/bin/env node

import prompts from 'prompts';
import { execSync } from 'child_process';
import { rmSync, existsSync, copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import { log } from './custom-logger.js';

// Version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  console.log(`v${pkg.version}`);
  process.exit(0);
}

// Template map
const TEMPLATE_MAP = {
  'javascript-mongo': 'https://github.com/logicalHassan/node-express-boilerplate.git',
  'typescript-mongo': 'https://github.com/logicalHassan/nodets-express-boilerplate.git',
  'typescript-prisma': 'https://github.com/logicalHassan/express-postgres-prisma.git',
  'typescript-drizzle': 'https://github.com/logicalHassan/express-postgres-drizzle.git',
};

// Helpers
function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function removeGit(dir) {
  const gitPath = path.join(dir, '.git');
  if (existsSync(gitPath)) {
    rmSync(gitPath, { recursive: true, force: true });
  }
}

function cleanUpGenerators(projectPath, generatorPath) {
  const generatorsDir = path.join(projectPath, generatorPath);
  if (existsSync(generatorsDir)) {
    rmSync(generatorsDir, { recursive: true, force: true });
  }

  const plopfilePath = path.join(projectPath, 'plopfile.js');
  if (existsSync(plopfilePath)) {
    unlinkSync(plopfilePath);
  }

  const pkgPath = path.join(projectPath, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    delete pkg.devDependencies?.plop;
    delete pkg.scripts?.generate;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  console.log('Cleaned up generators.');
}

async function main() {
  log.title('\n🚀 Welcome to get-express-starter\n');

  const onCancel = () => {
    log.error('Cancelled by user.');
    process.exit(0);
  };

  const { projectName } = await prompts(
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-api-server',
    },
    { onCancel }
  );

  const projectPath = path.resolve(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    log.error('A directory with that name already exists. Please choose another.');
    process.exit(1);
  }

  const { language } = await prompts(
    {
      type: 'select',
      name: 'language',
      message: 'Choose language:',
      choices: [
        { title: 'TypeScript (recommended)', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
      ],
    },
    { onCancel }
  );

  let templateKey = 'javascript-mongo';

  if (language === 'typescript') {
    const { database } = await prompts(
      {
        type: 'select',
        name: 'database',
        message: 'Choose database:',
        choices: [
          { title: 'MongoDB', value: 'mongo' },
          { title: 'PostgreSQL (Prisma)', value: 'prisma' },
          { title: 'PostgreSQL (Drizzle)', value: 'drizzle' },
        ],
      },
      { onCancel }
    );

    templateKey = `typescript-${database}`;
  }

  const repo = TEMPLATE_MAP[templateKey];
  if (!repo) {
    log.error(`No template found for "${templateKey}"`);
    process.exit(1);
  }

  const { includeGenerators } = await prompts(
    {
      type: 'confirm',
      name: 'includeGenerators',
      message: 'Include code generators?',
      initial: true,
    },
    { onCancel }
  );

  run(`git clone --depth 1 ${repo} ${projectName}`);
  removeGit(projectPath);

  if (!includeGenerators) {
    const generatorDir = templateKey === 'typescript-prisma' ? 'templates' : 'generators';
    cleanUpGenerators(projectPath, generatorDir);
  }

  const envExample = path.join(projectPath, '.env.example');
  const envFile = path.join(projectPath, '.env');
  if (existsSync(envExample)) {
    copyFileSync(envExample, envFile);
    console.log('Created .env from .env.example');
  }

  log.success('\n🎉 Project setup complete!\n');
  log.info(`Next steps:\n`);
  console.log(`   cd ${projectName}`);
  console.log(`   pnpm install`);
  console.log(`   pnpm run dev\n`);
}

main();
