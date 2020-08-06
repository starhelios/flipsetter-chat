module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
      modules: true,
    },
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-native',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
  ],
  rules: {
    'import/prefer-default-export': 0,
    'react/jsx-props-no-spreading': 0,
    'arrow-body-style': 0,
    'react/jsx-filename-extension': 0,
  },
};
