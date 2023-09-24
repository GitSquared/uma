import {
	isServiceActive,
	startLocationService,
	stopLocationService,
} from '@lib/services/background-location'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { useEffect } from 'react'

export default function BackgroundLocationServiceController() {
	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)

	useEffect(() => {
		void (async () => {
			const running = await isServiceActive()

			if (!batterySaver) {
				console.info('Starting background location service')
				// Make sure to redefine the task parameters every time at app launch
				// or settings switch
				if (running) {
					try {
						await stopLocationService()
					} catch (error) {
						console.warn('Error when stopping location service', error)
					}
				}

				try {
					await startLocationService()
				} catch (e) {
					console.error('Failed to start location service: ' + e)
				}
			} else if (running) {
				console.info('Stopping background location service')
				await stopLocationService()
			}
		})()
	}, [batterySaver])

	return null
}
