/** @type {import('eslint').Linter.Config} */
export default {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node'],
  rules: {
    'comma-dangle': ['warn', 'always-multiline'],
    quotes: [2, 'single', { avoidEscape: true }],
    semi: 'warn',
  },
};
