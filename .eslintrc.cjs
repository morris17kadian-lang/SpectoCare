module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'build/', '*.config.js', '*.config.cjs', 'coverage/'],
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      env: { browser: true, react: true },
      rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
