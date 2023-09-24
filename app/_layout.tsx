import { Caveat_700Bold } from '@expo-google-fonts/caveat'
import { InterTight_700Bold } from '@expo-google-fonts/inter-tight'
import { Lexend_400Regular, Lexend_500Medium } from '@expo-google-fonts/lexend'
import { safeBottomSheetViewScreenOptions } from '@lib/components/generic/SafeBottomSheetView'
import BackgroundLocationServiceController from '@lib/services/BackgroundLocationServiceController'
import { setupRoutingInstrumentation } from '@lib/services/monitoring'
import TracingCrawlerServiceProvider from '@lib/services/tracing-crawler/TracingCrawlerServiceProvider'
import WebWorkerThreadProvider from '@lib/services/web-worker/WebWorkerThreadProvider'
import DatabaseProvider, {
	initializeDatabase,
} from '@lib/utils/DatabaseProvider'
import SettingsProvider from '@lib/utils/SettingsProvider'
import * as Font from 'expo-font'
import { SplashScreen, Stack, useRootNavigation } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'
import RNUxcam from 'react-native-ux-cam'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false)

	useEffect(() => {
		async function prepareApp() {
			console.info('Preparing app...')

			console.info('Initializing database...')

			await initializeDatabase()

			console.info('Database initialized')

			console.info('Loading fonts...')

			try {
				await Font.loadAsync({
					'Proto Mono':
						require('@assets/fonts/ProtoMono-Regular.ttf') as number,
					Caveat: Caveat_700Bold,
					Lexend: Lexend_400Regular,
					'Lexend-Medium': Lexend_500Medium,
					'Inter-Tight-Bold': InterTight_700Bold,
				})
			} catch (e) {
				console.warn('error loading fonts', e)
			}

			console.info('Fonts loaded')

			setAppIsReady(true)
		}
		void prepareApp()
	}, [])

	useEffect(() => {
		if (appIsReady) {
			console.info("App is ready, let's go!")
			SplashScreen.hideAsync()
		}
	}, [appIsReady])

	Updates.useUpdateEvents((e) => {
		console.debug('eas update event', e)
	})
	useEffect(() => {
		console.log('Expo updates status', {
			channel: Updates.channel,
			runtime: Updates.runtimeVersion,
		})
	}, [])

	const navigation = useRootNavigation()

	useEffect(() => {
		if (navigation) {
			setupRoutingInstrumentation(navigation)
		}

		const onStateChange = () => {
			const screenName = navigation?.getCurrentRoute()?.name
			if (!screenName) return

			RNUxcam.tagScreenName(screenName)
		}

		navigation?.addListener('state', onStateChange)

		return () => {
			navigation?.removeListener('state', onStateChange)
		}
	}, [navigation])

	if (!appIsReady) {
		return null
	}

	return (
		<DatabaseProvider>
			<SettingsProvider>
				<WebWorkerThreadProvider>
					<TracingCrawlerServiceProvider>
						<StatusBar style="dark" />

						<BackgroundLocationServiceController />

						<Stack
							screenOptions={{
								headerShown: false,
								orientation: 'portrait',
							}}
						>
							<Stack.Screen
								name="onboarding"
								options={{
									animation: 'fade',
								}}
							/>
							<Stack.Screen
								name="home"
								options={{
									animation: 'fade',
								}}
							/>
							<Stack.Screen
								name="settings"
								options={safeBottomSheetViewScreenOptions}
							/>
						</Stack>
					</TracingCrawlerServiceProvider>
				</WebWorkerThreadProvider>
			</SettingsProvider>
		</DatabaseProvider>
	)
}
