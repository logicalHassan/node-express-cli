#!/usr/bin/env node

import { execSync } from 'child_process';
import { rmSync, existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import prompts from 'prompts';

import { TEMPLATE_MAP, AVAILABLE_PLUGINS, DEFAULT_PACKAGE_MANAGER } from './constants.js';
import { log } from './utils/custom-logger.js';
import { GeneratorActions } from './utils/generator-action.js';
import { showHelp } from './utils/show-help.js';
import { checkForUpdates } from './utils/update-checker.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

// --- HELPERS ---

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function removeGit(dir) {
  if (existsSync(path.join(dir, '.git'))) {
    rmSync(path.join(dir, '.git'), { recursive: true, force: true });
  }
}

function addDependencies(projectPath, dependencies, isDev = false) {
  const pkgPath = path.join(projectPath, 'package.json');
  if (!existsSync(pkgPath)) return;

  const pkgData = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const target = isDev ? 'devDependencies' : 'dependencies';

  if (!pkgData[target]) pkgData[target] = {};
  Object.assign(pkgData[target], dependencies);

  writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2));
}

async function verifyProjectIntegrity() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let isCompatible = false;

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf-8');
    if (content.includes('[get-express-starter]')) {
      isCompatible = true;
    }
  }

  if (!isCompatible) {
    log.warn('Project compatibility signature not found in .gitignore');
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message:
        'This project does not appear to be scaffolded by get-express-starter. Adding plugins might break your code. Proceed at your own risk?',
      initial: false,
    });

    if (!proceed) {
      log.error('Operation cancelled.');
      process.exit(0);
    }
  }
  return true;
}

function detectProjectLanguage() {
  return existsSync(path.join(process.cwd(), 'tsconfig.json')) ? 'typescript' : 'javascript';
}

function installDependencies(projectPath) {
  const pm = DEFAULT_PACKAGE_MANAGER;
  console.log('');
  log.info(`Installing dependencies using ${pm}...`);
  try {
    run(`${pm} install`, { cwd: projectPath });
    log.success('Dependencies installed successfully.');
  } catch (error) {
    log.error('Failed to install dependencies automatically.');
    console.log(`Please run '${pm} install' manually.`);
  }
}

// --- COMMAND HANDLERS ---

async function handleAddCommand(args) {
  await verifyProjectIntegrity();

  const language = detectProjectLanguage();

  let pluginKey = args[1];

  if (pluginKey && !AVAILABLE_PLUGINS[pluginKey]) {
    log.warn(`Plugin '${pluginKey}' not found.`);
    pluginKey = undefined;
  }

  if (!pluginKey) {
    const { selected } = await prompts({
      type: 'select',
      name: 'selected',
      message: 'Which plugin would you like to add?',
      choices: Object.values(AVAILABLE_PLUGINS).map((p) => ({
        title: p.name,
        value: Object.keys(AVAILABLE_PLUGINS).find((key) => AVAILABLE_PLUGINS[key] === p),
      })),
    });
    pluginKey = selected;
  }

  if (!pluginKey || !AVAILABLE_PLUGINS[pluginKey]) {
    log.error('No valid plugin selected.');
    process.exit(1);
  }

  const plugin = AVAILABLE_PLUGINS[pluginKey];
  const projectPath = process.cwd();

  console.log('');
  log.info(`Configuring ${plugin.name}...`);
  console.log('');

  const actions = new GeneratorActions(projectPath, true);

  try {
    plugin.apply(projectPath, language, actions);

    if (plugin.dependencies) {
      addDependencies(projectPath, plugin.dependencies);
    }
    if (plugin.devDependencies) {
      addDependencies(projectPath, plugin.devDependencies, true);
    }

    installDependencies(projectPath);
    log.success(`Successfully added ${plugin.name}`);
  } catch (error) {
    log.error(`Failed to add plugin: ${error.message}`);
    console.error(error);
  }
}

async function handleScaffoldCommand() {
  log.title('\nWelcome to get-express-starter\n');

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
    log.error(`Directory "${projectName}" already exists.`);
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

  const { selectedPlugins } = await prompts(
    {
      type: 'multiselect',
      name: 'selectedPlugins',
      message: 'Select additional features:',
      choices: Object.keys(AVAILABLE_PLUGINS).map((key) => ({
        title: AVAILABLE_PLUGINS[key].name,
        value: key,
      })),
      hint: '- Space to select. Return to submit',
    },
    { onCancel }
  );

  log.info('Scaffolding project...');

  try {
    run(`git clone --depth 1 ${TEMPLATE_MAP[templateKey]} ${projectName}`, { stdio: 'ignore' });
    removeGit(projectPath);
  } catch (e) {
    log.error('Failed to clone repository');
    process.exit(1);
  }

  // --- PLUGINS ---
  if (selectedPlugins.length > 0) {
    log.info('Configuring plugins...\n');

    const actions = new GeneratorActions(projectPath, false);

    selectedPlugins.forEach((key) => {
      const plugin = AVAILABLE_PLUGINS[key];
      try {
        plugin.apply(projectPath, language, actions);

        if (plugin.dependencies) {
          addDependencies(projectPath, plugin.dependencies);
        }
        if (language === 'typescript' && plugin.devDependencies) {
          addDependencies(projectPath, plugin.devDependencies, true);
        }
        log.success(`${plugin.name} configured`);
      } catch (error) {
        console.log('handleScaffoldCommand ~ error:', error);
        log.error(`Failed to configure ${plugin.name}`);
      }
    });
  }

  const envExample = path.join(projectPath, '.env.example');
  const envFile = path.join(projectPath, '.env');
  if (existsSync(envExample)) {
    copyFileSync(envExample, envFile);
  }

  log.success(`Project ${projectName} created successfully!\n`);
  console.log(`   cd ${projectName}`);
  console.log(`   pnpm install`);
  console.log(`   pnpm run dev\n`);
}

// --- MAIN EXECUTION ---

async function main() {
  await checkForUpdates(pkg);

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) return showHelp(pkg);
  if (args.includes('--version') || args.includes('-v')) {
    console.log(pkg.version);
    process.exit(0);
  }

  if (args[0] === 'add') {
    await handleAddCommand(args);
  } else if (args.length === 0) {
    await handleScaffoldCommand();
  } else {
    log.error(`Unknown command: ${args[0]}`);
    console.log(`Run ${pkg.name} --help for usage.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
