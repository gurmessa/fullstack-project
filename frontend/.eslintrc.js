module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'airbnb-typescript', //# ref: https://www.npmjs.com/package/eslint-config-airbnb-typescript
		'airbnb/hooks',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:eslint-comments/recommended',
		'plugin:promise/recommended',
		'plugin:unicorn/recommended',
		'prettier',
		'prettier/react',
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'eslint-comments', 'promise', 'unicorn', 'react', 'react-hooks'],
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'import/prefer-default-export': 0,
		// Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
		'react/destructuring-assignment': 0,
		// Use function hoisting to improve code readability
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': [
			'error',
			{ functions: false, classes: true, variables: true, typedefs: true },
		],
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,

		// Common abbreviations are known and readable
		'unicorn/prevent-abbreviations': 0,
		'unicorn/filename-case': 0, // snake_case is useful when working with Django REST API
		'react/state-in-constructor': 0, // Old fashion
		'import/no-default-export': 0, // Too restrictive
		'class-methods-use-this': 0, // Too restrictive
		'no-param-reassign': 0,
		'import/extensions': 0,
		'import/no-unresolved': 0,
		'react/jsx-props-no-spreading': 0,
		// Covered by ts
		'@typescript-eslint/no-unused-vars': 0,
		// Project uses TS for static type check
		'react/prop-types': 0,
		'unicorn/consistent-function-scoping': 0,
		'unicorn/catch-error-name': 0,
		'@typescript-eslint/camelcase': 0,
		// Seems to be misbehaving with antd components
		'jsx-a11y/label-has-associated-control': 0,
		// Acts funny when destructuring
		'no-shadow': 0,
		// Too restrictive
		'unicorn/explicit-length-check': 0,
		'react/no-array-index-key': 0,
		'react/jsx-boolean-value': 0,
		'unicorn/prefer-spread': 0,
		'no-prototype-builtins': 0,
		// Might consider turning this back on later
		'promise/catch-or-return': 0,
		'promise/always-return': 0,
		'@typescript-eslint/no-explicit-any': 0,
		// Conflicts with triple-slash directives
		'spaced-comment': 0,
		// Accessibility Warnings
		'jsx-a11y/anchor-is-valid': 1,
		'react/require-default-props': 0,
	},
}
