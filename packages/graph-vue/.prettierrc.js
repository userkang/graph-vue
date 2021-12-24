module.exports = {
  trailingComma: 'none',
  bracketSpacing: true,
  endOfLine: 'lf',
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'avoid',
  overrides: [
    {
      files: ['src/**/*.vue'],
      options: {
        printWidth: 80,
        htmlWhitespaceSensitivity: 'ignore'
      }
    }
  ]
}
