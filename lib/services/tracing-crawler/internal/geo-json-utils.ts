import ComputedFogShape from '@lib/entities/ComputedFogShape'
import { difference, flatten, getType, polygon, truncate } from '@turf/turf'

import {
	TARGET_GEOMETRY_DIMENSIONS,
	TARGET_GEOMETRY_PRECISION,
} from '../consts'

export function isPoint(
	shape: GeoJSON.Feature,
): shape is GeoJSON.Feature<GeoJSON.Point> {
	return getType(shape) === 'Point'
}

export function isLineString(
	shape: GeoJSON.Feature,
): shape is GeoJSON.Feature<GeoJSON.LineString> {
	return getType(shape) === 'LineString'
}

export function isPolygon(
	shape: GeoJSON.Feature,
): shape is GeoJSON.Feature<GeoJSON.Polygon> {
	return getType(shape) === 'Polygon'
}

export function standardizeGeometry<T extends Parameters<typeof truncate>[0]>(
	shape: T,
): T {
	return truncate(shape, {
		precision: TARGET_GEOMETRY_PRECISION,
		coordinates: TARGET_GEOMETRY_DIMENSIONS,
		mutate: true,
	})
}

export const WHOLE_WORLD_GEOJSON_POLYGON = polygon([
	[
		[-180, 90],
		[180, 90],
		[180, -90],
		[-180, -90],
		[-180, 90],
	],
])

export function renderFogMask(
	fogShapes: ComputedFogShape['geojson'][],
): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
	const worldMask = WHOLE_WORLD_GEOJSON_POLYGON

	let maskedFog: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> =
		worldMask
	for (const fogShape of fogShapes) {
		for (const polygon of fogShape.features) {
			maskedFog = difference(maskedFog, polygon) || maskedFog
		}
	}

	const flattenedFog = flatten(maskedFog)

	return flattenedFog
}
