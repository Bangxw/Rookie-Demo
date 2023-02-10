module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@src', './src'],
          ['@i18n', './src/i18n'],
          ['@pages', './src/pages'],
          ['@components', './src/pages/components'],
          ['@redux', './src/redux'],
          ['@styles', './src/styles'],
          ['@utils', './src/utils'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': 0, // JSX not allowed in files with extension '.js'
    camelcase: 0,
  },
};
