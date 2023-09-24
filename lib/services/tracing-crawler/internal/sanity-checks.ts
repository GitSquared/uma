import LocationPoint from '@lib/entities/LocationPoint'
import { distanceBetweenPoints } from '@lib/utils/math'

import { FOG_CLEARING_RADIUS_METERS } from '../consts'

export function shouldDrawPoint(point: LocationPoint): boolean {
	if (point.accuracy && point.accuracy > FOG_CLEARING_RADIUS_METERS)
		return false
	if (point.altitude && point.altitude < -5) return false
	if (point.altitude && point.altitude > 8000) return false
	if (point.speed && point.speed > 200) return false

	return true
}

export function shouldDrawLine(
	fromPoint: LocationPoint,
	toPoint: LocationPoint,
): boolean {
	if (!shouldDrawPoint(fromPoint)) return false
	if (!shouldDrawPoint(toPoint)) return false

	if (
		fromPoint.timestamp.getTime() - toPoint.timestamp.getTime() >
		1000 * 60 * 20 // 20 minutes
	)
		return false

	if (
		Math.abs(distanceBetweenPoints(fromPoint, toPoint)) >
		FOG_CLEARING_RADIUS_METERS * 3
	)
		return false

	return true
}
