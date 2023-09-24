module.exports = {
	env: {
		es2021: true,
	},
	root: true,
	plugins: [
		'react',
		'@typescript-eslint',
		'react-native',
		'react-hooks',
		'prettier',
		'simple-import-sort',
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:react-native/all',
		'plugin:react-hooks/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [],
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				useTabs: true,
				semi: false,
			},
		],
		'simple-import-sort/imports': 2,
		'simple-import-sort/exports': 2,
		'react-native/no-raw-text': 'off', // Cause issues with custom Text wrapper
		'react/jsx-uses-react': 'off', // We have support for React 17 automatic runtime
		'react/react-in-jsx-scope': 'off',
		'react/no-unescaped-entities': 'off', // &quot; yourself
		'@typescript-eslint/no-var-requires': 'off', // We use require() for some dynamic imports and assets
	},
}
