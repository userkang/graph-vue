module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020
  },
  globals: {
    __ENV__: 'readonly'
  },
  rules: {
    quotes: 'off',
    indent: 'off',
    semicolon: 'off',
    'prettier/prettier': 'off',
    'vue/no-v-html': 'warn',
    'no-useless-escape': 'off',
    'prefer-const': 'warn',
    'no-extra-boolean-cast': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off',
    'max-classes-per-file': 'off',
    'no-bitwise': 'off',
    'arrow-parens': 'off',
    'accessor-pairs': 'off',
    'no-undef': 'off',
    'no-undef-init': 'warn',
    'init-declarations': 'warn',
    'no-empty': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off'
  }
}
