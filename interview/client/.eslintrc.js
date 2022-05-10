// Pour désactiver toutes les règles eslint dans un fichier js
// /* eslint-disable */
// console.log('test') ;
// Pour désactiver une règle spécifique dans un fichier js
// /* eslint-disable no-console*/
// console.log('test') ;
// Pour désactiver une règle spécifique sur une seule ligne
// console.log('test') ; // eslint-disable-line no-console

// Tu peux utiliser la commande npx prettier --write . pour formater tous les fichiers à la fois
// Tu peux utiliser la commande npx prettier --write index.js . pour formater tous un seul fichier à la fois

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/prop-types': 'off',
    'no-console': 'off',
    'react/no-unescaped-entities': 0,
    'jsx-a11y/media-has-caption': [
      2,
      {
        audio: ['Audio'],
        video: ['Video'],
        track: ['Track'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};
