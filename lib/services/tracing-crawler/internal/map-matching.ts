import * as polyline from '@googlemaps/polyline-codec'
import LocationPoint from '@lib/entities/LocationPoint'
import config from '@lib/utils/config'
import * as turf from '@turf/turf'

import { TracedGeometry } from '../types'

const valhallaServerUrl = config?.mapServicesApiUrl as string

interface ValhallaMapMatchingResponse {
	trip: {
		status: number
		locations: {
			lat: number
			lon: number
		}[]
		legs: {
			shape: string
		}[]
	}
}

export async function snapTraceToRoad(
	points: LocationPoint[],
): Promise<TracedGeometry | undefined> {
	if (points.length < 2)
		throw new Error('Need at least 2 points to snap to road')

	// Snap GPS trace to road
	// Leveraging Valhalla map matching API
	// ref: https://valhalla.github.io/valhalla/api/map-matching/api-reference/
	try {
		const requestBody = {
			costing: 'pedestrian',
			shape_match: 'map_snap',
			trace_options: {
				turn_penalty_factor: 500,
			},
			directions_type: 'none',
			format: 'json',
			shape: points.map((point) => ({
				time: point.timestamp.getTime() / 1000,
				lon: point.longitude,
				lat: point.latitude,
				radius: point.accuracy,
				heading: point.heading,
			})),
		}

		const response = await fetch(`${valhallaServerUrl}/trace_route`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		if (!response.ok) throw new Error('Failed to snap to road')

		const responseObject =
			(await response.json()) as ValhallaMapMatchingResponse

		if (responseObject.trip.status !== 0) return undefined

		const encodedPolyline = responseObject.trip.legs.at(0)?.shape

		if (!encodedPolyline) return undefined

		const decodedPolyline = polyline.decode(encodedPolyline, 6) // very important: Valhalla uses 6-digit precision

		const geojsonCoordinates = decodedPolyline.map((coords) => [
			// geojson uses a [lon, lat] format
			coords[1],
			coords[0],
		])

		const lineString = turf.lineString(geojsonCoordinates)

		return lineString
	} catch (error) {
		console.error(error)
		return undefined
	}
}
