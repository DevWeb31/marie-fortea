/** @type {import("prettier").Config} */
export default {
  // Configuration de base
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  
  // Configuration spécifique aux fichiers
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 100,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        singleQuote: false,
      },
    },
  ],
  
  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],
};
