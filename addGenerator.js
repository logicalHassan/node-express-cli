import fs from 'fs-extra';
import path from 'path';

export async function addGeneratorToProject(templateName, projectPath, cliRoot) {
  const generatorPath = path.join(cliRoot, 'generators', templateName);

  if (!(await fs.pathExists(generatorPath))) {
    console.log(`Generator not found for template: ${templateName}`);
    return;
  }

  // Copy plopfile.js and generators folder
  await fs.copy(path.join(generatorPath, 'plopfile.js'), path.join(projectPath, 'plopfile.js'));
  await fs.copy(path.join(generatorPath, 'generators'), path.join(projectPath, 'generators'));

  // Modify package.json
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);

  pkg.scripts = {
    ...pkg.scripts,
    generate: 'plop',
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    plop: '^4.0.1',
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}
