module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			['@babel/plugin-proposal-decorators', { version: 'legacy' }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
[
				'module-resolver',
				{
					root: ['./app'],
					alias: {
						'^@app/(.+)': './\\1',
						'^@lib/(.+)': './lib/\\1',
						'^@assets/(.+)': './assets/\\1',
						'^@web-worker/(.+)': './web-worker/\\1',
					},
					extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
				},
			],
			['expo-router/babel'],
			'react-native-reanimated/plugin',
		],
	}
}
