#!/usr/bin/env node

import prompts from 'prompts';
import { execSync } from 'child_process';
import { rmSync, existsSync, copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

// Template repo map
const TEMPLATE_MAP = {
  'javascript-mongo': 'https://github.com/logicalHassan/node-express-boilerplate.git',
  'typescript-mongo': 'https://github.com/logicalHassan/nodets-express-boilerplate.git',
  'typescript-postgres': 'https://github.com/logicalHassan/express-postgres-prisma.git',
};

// Run shell commands
function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

// Remove .git folder
function removeGit(dir) {
  const gitPath = path.join(dir, '.git');
  if (existsSync(gitPath)) {
    rmSync(gitPath, { recursive: true, force: true });
  }
}

// Clean up code generator files
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

    if (pkg.devDependencies?.plop) {
      delete pkg.devDependencies.plop;
    }

    if (pkg.scripts?.generate) {
      delete pkg.scripts.generate;
    }

    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  console.log('Cleaned up generators');
}

// Main CLI logic
async function main() {
  console.log('\nWelcome to get-express-starter!\n');

  const onCancel = () => {
    console.log('Cancelled by user.');
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
    console.error('Directory already exists. Choose another name.');
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
          { title: 'PostgreSQL', value: 'postgres' },
        ],
      },
      { onCancel }
    );

    templateKey = `typescript-${database}`;
  }

  const repo = TEMPLATE_MAP[templateKey];
  if (!repo) {
    console.error(`No template found for "${templateKey}"`);
    process.exit(1);
  }

  run(`git clone --depth 1 ${repo} ${projectName}`);
  removeGit(projectPath);

  // Prompt for code generators if template supports them
  let useGenerators = true;
  if (
    templateKey === 'typescript-postgres' ||
    templateKey === 'typescript-mongo' ||
    templateKey === 'javascript-mongo'
  ) {
    const { includeGenerators } = await prompts(
      {
        type: 'confirm',
        name: 'includeGenerators',
        message: 'Include code generators (Plop.js)?',
        initial: true,
      },
      { onCancel }
    );

    useGenerators = includeGenerators;
  }

  // Conditionally clean up generators
  if (!useGenerators) {
    const generatorDir = templateKey === 'typescript-postgres' ? 'templates' : 'generators';
    cleanUpGenerators(projectPath, generatorDir);
  }

  // Copy .env
  const envExample = path.join(projectPath, '.env.example');
  const envFile = path.join(projectPath, '.env');
  if (existsSync(envExample)) {
    copyFileSync(envExample, envFile);
    console.log('Created .env from .env.example');
  }

  // Done
  console.log('\n✅ Project is ready!\n');
  console.log(`   cd ${projectName}`);
  console.log('   pnpm install');
  console.log('   pnpm run dev');
  console.log('\n🎉 Happy coding!\n');
}

main();
