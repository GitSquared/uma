import type LocationPoint from '@lib/entities/LocationPoint'

export function deg2rad(deg: number): number {
	return deg * (Math.PI / 180)
}

export function distanceBetweenPoints(
	a: LocationPoint,
	b: LocationPoint,
): number {
	// Compute the distance in meters between two sets of coordinates using the haversine formula (crow-fly distance)

	const R = 6371e3 // Radius of the Earth in meters
	const dLat = deg2rad(b.latitude - a.latitude)
	const dLon = deg2rad(b.longitude - a.longitude)
	const lat1 = deg2rad(a.latitude)
	const lat2 = deg2rad(b.latitude)
	const alpha =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
	const c = 2 * Math.atan2(Math.sqrt(alpha), Math.sqrt(1 - alpha))
	const d = R * c // Distance in meters
	return d
}
