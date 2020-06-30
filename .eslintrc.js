/*
 * @Author: bianjie
 * @Date: 2020-05-11 10:46:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-24 15:43:31
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // basic
    strict: 0,
    'max-len': [2, 300, 2, { ignoreComments: true }],
    'linebreak-style': [0],
    'no-undef': 0,
    'consistent-return': 0,
    'no-plusplus': 0,
    'array-callback-return': 0,
    'global-require': 0,
    'no-script-url': 0,
    'no-extend-native': 0,
    'no-unresolved': 0,
    'import/prefer-default-export': 0,

    // Vue
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-reserved-keys': 'off',
    'vue/prop-name-casing': 'off',
    'vue/no-unused-components': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
