import { ThreadedFnName } from '@web-worker/functions'
import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

import WebWorkerThreadContext from './context'
import ThreadBridgeEventBus from './thread-bridge'

export default function WebWorkerThreadProvider({
	children,
}: {
	children: ReactNode
}) {
	const [threadBridgeEventBus, setThreadBridgeEventBus] =
		useState<ThreadBridgeEventBus | null>(null)

	const [bridgeReady, setBridgeReady] = useState(false)

	const webref = useRef<WebView>(null)

	const [webWorkerIife, setWebWorkerIife] = useState<string | undefined>()

	useEffect(() => {
		// Load web worker IIFE from asset bundle
		void (async () => {
			const webWorkerAsset = Asset.fromModule(
				require('@assets/web-worker.html') as number,
			)

			await webWorkerAsset.downloadAsync()

			if (!webWorkerAsset.localUri) return

			const webWorkerHtml = await FileSystem.readAsStringAsync(
				webWorkerAsset.localUri,
			)
			setWebWorkerIife(
				webWorkerHtml.replace('<script>', '').replace('</script>', ''),
			)
		})()
	}, [])

	useEffect(() => {
		if (!webref.current) return

		const eventBus = new ThreadBridgeEventBus(webref.current)

		const listenerId = eventBus.once('ready', () => {
			setBridgeReady(true)

			void (async () => {
				const result = await eventBus.waitFor(
					eventBus.submitJobRequest(
						ThreadedFnName.PerfTest,
						performance.now().toString(),
					),
				)
				const timer = performance.now() - Number(result)
				console.info(`ThreadBridge: perf test: ${timer.toFixed(2)}ms overhead`)
			})()
		})

		setThreadBridgeEventBus(eventBus)

		return () => {
			eventBus.unsubscribe('ready', listenerId)
		}
	}, [webref])

	return (
		<>
			<WebView
				containerStyle={styles.webviewContainer}
				ref={webref}
				originWhitelist={['localhost']}
				source={{
					html: `<h1>background processing thread</h1>`,
				}}
				onMessage={threadBridgeEventBus?.onThreadMessage}
				injectedJavaScript={webWorkerIife}
			/>
			<WebWorkerThreadContext.Provider
				value={bridgeReady ? threadBridgeEventBus : null}
			>
				{children}
			</WebWorkerThreadContext.Provider>
		</>
	)
}

const styles = StyleSheet.create({
	webviewContainer: {
		display: 'none',
	},
})
