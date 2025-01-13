module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          { pattern: '@nestjs/**', group: 'external', position: 'before' },
          { pattern: '@decorators/**', group: 'external', position: 'after' },
          { pattern: '@common/**', group: 'internal', position: 'before' },
          { pattern: '@modules/**', group: 'internal', position: 'after' },
          { pattern: '@filters/**', group: 'internal', position: 'after' },
          { pattern: '@pipes/**', group: 'internal', position: 'after' },
          { pattern: '@swagger/**', group: 'internal', position: 'after' },
          { pattern: '@validators/**', group: 'internal', position: 'after' },
          // Handle relative imports explicitly
          { pattern: './**', group: 'sibling', position: 'after' },
          { pattern: '../**', group: 'parent', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['@nestjs', '@decorators'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    'no-return-await': 'off',
    'require-await': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
    },
  },
};
