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
    es6: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 0,
    'eol-last': 0,
    'no-undef': 1,
    'comma-dangle': 0,
    'prefer-const': 1,
    'no-console': 1,
    'no-use-before-define': 1,
    'prefer-destructuring': 0,
    'no-shadow': 0,
    'no-use-before-define': 0,
    'no-unused-expressions': [
      'error',
      { allowTernary: true, allowShortCircuit: true },
    ],
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    eqeqeq: [1, 'smart'],
    'object-curly-newline': ['error', { multiline: true }],
    'jsx-a11y/media-has-caption': [
      2,
      {
        audio: ['Audio'],
        video: ['Video'],
        track: ['Track'],
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/prop-types': 2,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/jsx-wrap-multilines': 1,
    'react/button-has-type': 1,
    'react/jsx-no-bind': [
      2,
      {
        allowArrowFunctions: true,
        allowFunctions: true,
      },
    ],
    'react/destructuring-assignment': [
      1,
      'always',
      { ignoreClassFields: true, destructureInSignature: 'always' },
    ],
  },
};
