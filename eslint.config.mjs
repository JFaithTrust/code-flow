import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import pluginImport from 'eslint-plugin-import';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['src/components/ui/**', 'next-env.d.ts'], // UI kutubxonasi va next-env.d.ts faylini e'tiborsiz qoldirish
  },
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettier,

  // Plugins
  {
    plugins: {
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
      'better-tailwindcss': betterTailwind,
    },

    rules: {
      // ==== Best practices ====
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // ==== TypeScript ====
      '@typescript-eslint/no-unused-vars': 'off', // disable in favor of unused-imports plugin
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // ==== Import order ====
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ==== React & Hooks ====
      'react/react-in-jsx-scope': 'off', // Next.js da kerak emas
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ==== Accessibility (a11y) ====
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',

      // ==== Better Tailwind CSS ====
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        { ignore: ['prose', 'prose-sm', 'prose-lg', 'prose-invert'] },
        {
          whitelist: [
            'custom-scrollbar',
            'no-scrollbar',
            'active-theme',
            'mdxeditor-toolbar',
            'hash-span',
            'markdown',
          ],
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'error',
    },

    settings: {
      'better-tailwindcss': {
        config: 'tailwind.config.js', // tailwind config faylni ko‘rsatish
        entryPoint: 'src/app/globals.css', // Tailwind CSS import qilingan asosiy fayl
        callees: ['cn', 'clsx'], // agar helper ishlatsa (clsx, cn)
      },
    },
  },
];

export default eslintConfig;
