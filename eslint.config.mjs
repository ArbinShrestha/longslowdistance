import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^(_|ignore)' },
      ],
    },
  },
  { ignores: ['.next/', 'src/payload-types.ts', 'src/app/(payload)/admin/importMap.js', 'scripts/'] },
]

export default eslintConfig
