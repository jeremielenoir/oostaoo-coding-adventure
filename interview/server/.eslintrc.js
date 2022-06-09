// La commande npx prettier --write . formate tous les fichiers à la fois
// La commande npx prettier --write index.js formate un seul fichier à la fois

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-undef': 1,
    'prefer-const': 1,
    'no-console': 1,
    'no-unused-expressions': ['error', { allowTernary: true }],
    'id-length': 1,
    'no-var': 0,
    'no-new-object': 1,
    'prefer-object-spread': 1,
    'no-array-constructor': 1,
    'no-iterator': 1,
    'space-before-blocks': 1,
    'spaced-comment': 1,
    'keyword-spacing': ['warn', { before: true }],
    'space-infix-ops': 1,
    camelcase: 0,
  },
};
