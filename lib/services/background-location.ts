import LocationPoint from '@lib/entities/LocationPoint'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

export const backgroundLocationTaskName = 'traces-background-location-task'

export function backgroundLocationService({
	data: { locations },
	error,
}: TaskManager.TaskManagerTaskBody<{
	locations: Location.LocationObject[]
}>): void {
	if (error) {
		console.error(error)
		return
	}

	for (const location of locations) {
		const point = new LocationPoint()
		point.timestamp = new Date(location.timestamp)
		point.latitude = location.coords.latitude
		point.longitude = location.coords.longitude
		point.altitude = location.coords.altitude || undefined
		point.accuracy = location.coords.accuracy || undefined
		point.speed = location.coords.speed || undefined
		point.heading = location.coords.heading || undefined

		console.log('Recording location point', point)

		point.save().catch((e) => {
			console.warn('could not save point', e)
		})
	}
}

export async function isServiceActive(): Promise<boolean> {
	return Location.hasStartedLocationUpdatesAsync(backgroundLocationTaskName)
}

export async function startLocationService(): Promise<void> {
	const started = await isServiceActive()
	if (started) return

	await Location.startLocationUpdatesAsync(backgroundLocationTaskName, {
		accuracy: Location.Accuracy.Balanced,
		activityType: Location.ActivityType.Fitness,
		timeInterval: 2000,
		distanceInterval: 70,
		pausesUpdatesAutomatically: true,
		showsBackgroundLocationIndicator: false,
		mayShowUserSettingsDialog: false,
	})
}

export async function stopLocationService(): Promise<void> {
	const started = await isServiceActive()
	if (!started) return

	await Location.stopLocationUpdatesAsync(backgroundLocationTaskName)
}
