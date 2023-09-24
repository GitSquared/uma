import * as Location from 'expo-location'

export async function checkHasGrantedRequiredPermissions(): Promise<boolean> {
	console.info('Checking permissions...')

	const resf = await Location.getForegroundPermissionsAsync()
	const resb = await Location.getBackgroundPermissionsAsync()

	if (resf.granted && resb.granted) {
		console.info('Permissions granted')
		return true
	}
	console.info('Missing permissions')
	return false
}
