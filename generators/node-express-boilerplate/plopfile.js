module.exports = (plop) => {
  plop.setHelper('kebabCase', (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );

  plop.setHelper('camelCase', (text) => text.toLowerCase().replace(/-(.)/g, (_, group1) => group1.toUpperCase()));

  plop.setHelper('pascalCase', (text) =>
    text
      .toLowerCase()
      .replace(/-(.)/g, (_, group1) => group1.toUpperCase())
      .replace(/^(.)/, (_, group1) => group1.toUpperCase())
  );

  plop.setHelper('snakeCase', (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^-|_$/g, '')
  );

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

      const kebab = '{{kebabCase name}}';
      const camel = '{{camelCase name}}';

      if (data.features.includes('route')) {
        actions.push({
          type: 'add',
          path: `${basePath}/routes/${kebab}.routes.js`,
          templateFile: 'generators/route.hbs',
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/index.js`,
          pattern: /(import express from 'express';\n)/,
          template: `$1import ${camel}Route from './${kebab}.routes';\n`,
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/index.js`,
          pattern: /(const defaultRoutes = \[\n)/,
          template: `$1  {\n    path: '/${kebab}',\n    route: ${camel}Route,\n  },\n`,
        });
      }

      if (data.features.includes('controller')) {
        actions.push({
          type: 'add',
          path: `${basePath}/controllers/{{kebabCase name}}.controller.js`,
          templateFile: 'generators/controller.hbs',
        });
      }

      if (data.features.includes('service')) {
        actions.push({
          type: 'add',
          path: `${basePath}/services/{{kebabCase name}}.service.js`,
          templateFile: 'generators/service.hbs',
        });
      }

      if (data.features.includes('validation')) {
        actions.push({
          type: 'add',
          path: `${basePath}/validations/{{kebabCase name}}.validation.js`,
          templateFile: 'generators/validation.hbs',
        });
      }

      if (data.features.includes('model')) {
        actions.push({
          type: 'add',
          path: `${basePath}/models/{{kebabCase name}}.model.js`,
          templateFile: 'generators/model.hbs',
        });
      }

      return actions;
    },
  });
};
