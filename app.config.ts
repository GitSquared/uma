import * as dotenv from 'dotenv'
import { ConfigContext, ExpoConfig } from 'expo/config'

dotenv.config()

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'map app',
	slug: 'traces',
	owner: 'reality-co-open-source',
	version: '0.0.16',
	runtimeVersion: '0.0.16',
	scheme: 'traces',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'light',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'cover',
		backgroundColor: '#FFFFFF',
	},
	plugins: [
		[
			'expo-build-properties',
			{
				ios: {
					flipper: true,
				},
			},
		],
		[
			'expo-location',
			{
				locationAlwaysAndWhenInUsePermission:
					'let $(PRODUCT_NAME) trace your path as you go',
				locationAlwaysPermission:
					'let $(PRODUCT_NAME) trace your path as you go',
				isIosBackgroundLocationEnabled:
					'let $(PRODUCT_NAME) trace your path as you go',
				isAndroidBackgroundLocationEnabled:
					'let $(PRODUCT_NAME) trace your path as you go',
			},
		],
		[
			'@rnmapbox/maps',
			{
				RNMapboxMapsImpl: 'mapbox',
				RNMapboxMapsDownloadToken: process.env.MAPBOX_ACCESS_TOKEN,
			},
		],
	],
	ios: {
		supportsTablet: false,
		bundleIdentifier: 'com.traces.app',
		config: {
			usesNonExemptEncryption: false,
		},
		infoPlist: {
			UIBackgroundModes: ['location'],
			CADisableMinimumFrameDurationOnPhone: true,
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#FFFFFF',
		},
		package: 'com.traces.app',
		permissions: [
			'ACCESS_FINE_LOCATION',
			'ACCESS_COARSE_LOCATION',
			'ACCESS_BACKGROUND_LOCATION',
			'FOREGROUND_SERVICE',
			'WRITE_EXTERNAL_STORAGE',
			'READ_EXTERNAL_STORAGE',
			'INTERNET',
			'ACCESS_NETWORK_STATE',
		],
	},
	extra: {
		mapServicesApiUrl: process.env.MAP_SERVICES_API_URL,
		mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
	},
})
