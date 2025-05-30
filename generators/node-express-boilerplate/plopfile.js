/* eslint-disable no-param-reassign */
module.exports = (plop) => {
  // Configurable Naming Conventions
  const NAMING = {
    fileCase: 'kebabCase', // options: kebabCase, camelCase, pascalCase, snakeCase
    variableCase: 'camelCase', // options: camelCase, pascalCase, etc.
  };

  // Naming Helpers
  const normalizeInput = (text) =>
    text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();

  const toKebabCase = (text) =>
    normalizeInput(text)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const toCamelCase = (text) => normalizeInput(text).replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());

  const toPascalCase = (text) => toCamelCase(text).replace(/^./, (c) => c.toUpperCase());

  const toSnakeCase = (text) =>
    normalizeInput(text)
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

  // Register helpers with Plop
  plop.setHelper('kebabCase', toKebabCase);
  plop.setHelper('camelCase', toCamelCase);
  plop.setHelper('pascalCase', toPascalCase);
  plop.setHelper('snakeCase', toSnakeCase);

  // Generator Config
  const basePath = './src';

  plop.setGenerator('module', {
    description: 'Generate module (controller, service, route, validation, model)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (e.g. user, product):',
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          { name: 'Controller', value: 'controller', checked: true },
          { name: 'Service', value: 'service', checked: true },
          { name: 'Route', value: 'route', checked: true },
          { name: 'Validation', value: 'validation', checked: true },
          { name: 'Model', value: 'model', checked: true },
        ],
      },
    ],
    actions: (data) => {
      const actions = [];

      // Dynamically apply selected naming helpers
      const fileName = plop.getHelper(NAMING.fileCase)(data.name);
      const variableName = plop.getHelper(NAMING.variableCase)(data.name);

      // Expose them to templates
      data.fileName = fileName;
      data.variableName = variableName;

      if (data.features.includes('route')) {
        actions.push({
          type: 'add',
          path: `${basePath}/routes/${fileName}.routes.js`,
          templateFile: 'generators/route.hbs',
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/index.js`,
          // eslint-disable-next-line security/detect-unsafe-regex
          pattern: /(const [a-zA-Z]+Route = require\('.+\.routes?'\);\n)+/,
          template: `const ${variableName}Route = require('./${fileName}.routes');\n$&`,
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/index.js`,
          pattern: /(const defaultRoutes = \[\n)/,
          template: `$1  {\n    path: '/${fileName}',\n    route: ${variableName}Route,\n  },\n`,
        });
      }

      if (data.features.includes('controller')) {
        actions.push({
          type: 'add',
          path: `${basePath}/controllers/${fileName}.controller.js`,
          templateFile: 'generators/controller.hbs',
        });
      }

      if (data.features.includes('service')) {
        actions.push({
          type: 'add',
          path: `${basePath}/services/${fileName}.service.js`,
          templateFile: 'generators/service.hbs',
        });
      }

      if (data.features.includes('validation')) {
        actions.push({
          type: 'add',
          path: `${basePath}/validations/${fileName}.validation.js`,
          templateFile: 'generators/validation.hbs',
        });
      }

      if (data.features.includes('model')) {
        actions.push({
          type: 'add',
          path: `${basePath}/models/${fileName}.model.js`,
          templateFile: 'generators/model.hbs',
        });
      }

      return actions;
    },
  });
};
