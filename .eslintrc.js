module.exports = {
  parser: 'babel-eslint',

  plugins: ['flowtype', 'css-modules', 'prettier', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:css-modules/recommended',
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019,
  },

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'flowtype/delimiter-dangle': [2, 'always-multiline'],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'no-nested-ternary': 'off',
    'no-unused-vars': 'warn',
    'func-names': ['error', 'never'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    // Support for do-expressions
    'no-unused-expressions': 'off',
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-debugger': 'warn',
    'no-nested-ternary': 'off',

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: true,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',
    'react/forbid-prop-types': 'off',
    'react/static-property-placement': ['error', 'static public field'],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': ['warn', 'always', { ignoreClassFields: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
