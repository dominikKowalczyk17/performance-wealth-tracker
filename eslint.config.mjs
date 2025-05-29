import nx from '@nx/eslint-plugin';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export default [
  // Your existing Nx foundation - keep these as they provide monorepo-specific rules
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // Your existing ignores - essential for performance
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output',
      // Add a few more common build artifacts to ignore
      '**/node_modules',
      '**/.nx/cache',
      '**/coverage',
    ],
  },

  // Your existing Nx module boundaries rule - this is crucial for monorepo health
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    languageOptions: {
      ecmaVersion: '2022',
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  // Enhanced TypeScript rules - building on what Nx provided
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.base.json', // This connects ESLint to your TypeScript config
      },
    },
    rules: {
      // Type safety rules - catch common TypeScript pitfalls
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allow unused args that start with underscore
          varsIgnorePattern: '^_', // Useful for destructuring: const { used, _unused } = obj
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage 'any' but don't break builds
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Use ?? instead of || for null checks
      '@typescript-eslint/prefer-optional-chain': 'error', // Use obj?.prop instead of obj && obj.prop

      // Function documentation - helps with code maintainability
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true, // Arrow functions in components don't need return types
          allowTypedFunctionExpressions: true,
        },
      ],
    },
  },

  // Vue-specific configuration - this is new and addresses your Vue development needs
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vue,
    },
    rules: {
      // Vue component structure rules - enforce best practices
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'error', // Prevents generic names like "Button", prefer "BaseButton"
      'vue/component-definition-name-casing': ['error', 'PascalCase'], // ComponentName not componentName
      'vue/component-name-in-template-casing': ['error', 'PascalCase'], // <ComponentName> not <component-name>

      // Props and event handling
      'vue/prop-name-casing': ['error', 'camelCase'], // propName not prop-name
      'vue/custom-event-name-casing': ['error', 'camelCase'], // eventName not event-name
      'vue/v-on-event-hyphenation': ['error', 'never'], // @eventName not @event-name

      // Template organization
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION', // is, v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if, v-show
            'RENDER_MODIFIERS', // v-once, v-pre
            'GLOBAL', // id, key
            'UNIQUE', // ref, slot
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // v-custom-directive
            'OTHER_ATTR', // custom props
            'EVENTS', // @click
            'CONTENT', // v-text, v-html
          ],
          alphabetical: false,
        },
      ],

      // Code quality in templates
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'warn', // Warn about imported but unused components
      'vue/require-default-prop': 'off', // TypeScript handles this better than Vue's runtime checks
    },
  },

  // Code quality rules for all JavaScript/TypeScript files
  {
    files: ['**/*.{js,ts,tsx,jsx,vue}'],
    rules: {
      // Modern JavaScript practices
      'prefer-const': 'error', // Use const when variable isn't reassigned
      'no-var': 'error', // Use let/const instead of var
      'no-console': 'warn', // Allow console in development, but warn about it
      'no-debugger': 'error', // Never leave debugger statements

      // Import organization - keeps your imports clean
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // Let your IDE or prettier handle this
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],

      // Consistent code style
      'object-shorthand': 'error', // { name } instead of { name: name }
      'prefer-template': 'error', // `Hello ${name}` instead of 'Hello ' + name
    },
  },

  // Test files get more relaxed rules
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', '**/*test*/**/*.{js,ts,tsx}'],
    rules: {
      'no-console': 'off', // Console logging is fine in tests
      '@typescript-eslint/no-explicit-any': 'off', // Tests might need any for mocking
      '@typescript-eslint/no-non-null-assertion': 'off', // Test data can use ! operator
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {},
  },
];
