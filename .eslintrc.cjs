module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: { version: 'detect' },
  },
  env: {
    browser: true,
    node: true,
  },
};
