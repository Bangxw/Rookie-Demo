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
  rules: {
    camelcase: [0, {
      properties: 'never',
    }],
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-unused-vars': 1,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
  },
};
