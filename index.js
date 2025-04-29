#!/usr/bin/env node

import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));

const log = console.log;

async function main() {
  log(chalk.cyan("🚀 Welcome to create-api-kit"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Your project folder name:",
      default: "my-api-server",
    },
    {
      type: "list",
      name: "template",
      message: "Choose a base boilerplate:",
      choices: ["CommonJS", "ESM"],
    },
    // {
    //   type: "checkbox",
    //   name: "modules",
    //   message: "Select optional modules:",
    //   choices: ["Redis", "S3"],
    // },
  ]);

  const projectPath = join(process.cwd(), answers.projectName);
  const baseTemplate = answers.template === "CommonJS" ? "base-commonjs" : "base-esm";

  log(chalk.green(`\nCreating project in: ${projectPath}`));

  await fs.copy(join(__dirname, "templates", baseTemplate), projectPath);
  log(chalk.yellow("✔ Base template copied."));

  // for (const mod of answers.modules) {
  //   const modPath = mod.toLowerCase();
  //   await fs.copy(join(__dirname, "templates", "modules", modPath), projectPath);
  //   log(chalk.yellow(`✔ Added ${mod} module.`));
  // }

  log(chalk.green("\n✅ Setup complete!"));
  log(chalk.blue(`\nTo start:\n  cd ${answers.projectName} && npm install && npm run dev`));
}

main().catch((err) => {
  console.error(chalk.red("❌ Error:"), err);
  process.exit(1);
});
