const { getDefaultConfig } = require('expo/metro-config')

module.exports = (() => {
	const config = getDefaultConfig(__dirname)

	const { transformer, resolver } = config

	config.transformer = {
		...transformer,
		babelTransformerPath: require.resolve('react-native-svg-transformer'),
		unstable_allowRequireContext: true,
		minifierConfig: {
			keep_classnames: true,
			keep_fnames: true,
			module: true,
			mangle: {
				module: true,
				keep_classnames: true,
				keep_fnames: true,
			},
		},
	}
	config.resolver = {
		...resolver,
		assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
		sourceExts: [...resolver.sourceExts, 'svg'],
	}

	return config
})()
