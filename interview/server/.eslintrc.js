// La commande npx prettier --write . formate tous les fichiers à la fois
// La commande npx prettier --write index.js formate un seul fichier à la fois

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-console': 'off',
    allowTernary: 'true',
  },
};
