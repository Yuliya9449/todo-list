import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'package.json', 'pnpm-lock.yaml']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Предупреждать о console.log, но разрешить warn и error
      'no-debugger': 'warn', // предупреждение о debugger
      'no-unused-vars': 'off', // Отключаем базовое правило (неиспользуемые переменные)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Игнорировать параметры, начинающиеся с _
          varsIgnorePattern: '^_', // Игнорировать переменные, начинающиеся с _
          caughtErrorsIgnorePattern: '^_', // Игнорировать ошибки в catch, начинающиеся с _
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // any запрещён
    },
  },
])
