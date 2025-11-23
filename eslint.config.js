import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['node_modules', 'dist', 'temp-test-output', '*.config.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
      globals: {
        ...nodePlugin.configs.recommended.globals,
      },
    },
    plugins: {
      n: nodePlugin,
      import: importPlugin,
    },
    rules: {
      'n/file-extension-in-import': ['error', 'always'],
      'n/no-missing-import': ['error', { allowModules: [] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      semi: ['error', 'always'],
      'no-unused-vars': 'warn',
    },
  },
];
