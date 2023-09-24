import * as turf from '@turf/turf'

import { FOG_CLEARING_RADIUS_METERS } from '../consts'
import { FogShapeGeometries, FogShapeGeometry, TracedGeometry } from '../types'
import { isPolygon, standardizeGeometry } from './geo-json-utils'
import { compareAndMergeListItems } from './logic'

export function expandOrCreateFog(
	newGeometry: TracedGeometry,
	previousFog?: FogShapeGeometries,
): FogShapeGeometries {
	const newCutoutShape = standardizeGeometry(
		turf.buffer(newGeometry, FOG_CLEARING_RADIUS_METERS, {
			units: 'meters',
			steps: 10,
		}),
	)

	if (!previousFog) return turf.featureCollection([newCutoutShape])

	const newFog: FogShapeGeometries = turf.featureCollection([
		// Take last fog
		...previousFog.features,
		// Add new cutout
		newCutoutShape,
	])

	// Perf: look only at the new cutout shape when trying to merge shapes
	// The other ones shouldn't have changed, so no need to re-check them
	// disabled for now because we suspect it's causing a disappearing shape issue
	// mergeIntersectingFogPolygons(newFog, newCutoutShape)
	mergeIntersectingFogPolygons(newFog, [newCutoutShape])

	return newFog
}

export function mergeComputedFogGeometries(
	shapeA: FogShapeGeometries, // most recent
	shapeB: FogShapeGeometries, // oldest
): FogShapeGeometries {
	const mergedFog: FogShapeGeometries = turf.featureCollection([
		...shapeA.features,
		...shapeB.features,
	])

	// Check for potential merges over the entire collection of shapes
	mergeIntersectingFogPolygons(mergedFog, shapeA.features)

	return mergedFog
}

function mergeIntersectingFogPolygons(
	fog: FogShapeGeometries,
	// fast mode: only debounce a single specific polygon
	fastModeShapes?: FogShapeGeometry[],
	// returns nothing, mutates fog object in place
): void {
	const fogPolygons: FogShapeGeometry[] = fog.features

	// Merge overlapping shapes + clean up redundant ones
	compareAndMergeListItems(
		fogPolygons,
		(shape, otherShape, actions) => {
			if (turf.booleanWithin(shape, otherShape)) {
				// This shape is already contained in another shape
				// Delete it
				return actions.delete
			}
			if (turf.booleanOverlap(shape, otherShape)) {
				// This shape overlaps with another shape, merge them
				const mergedShape = turf.union(shape, otherShape)

				if (mergedShape === null || !isPolygon(mergedShape)) {
					// union failed, keep both shapes
					return actions.continue
				}
				// Simplify shape & smooth out edges
				const cleanShape: FogShapeGeometry = standardizeGeometry(
					turf.polygonSmooth(
						turf.simplify(mergedShape, {
							highQuality: false,
							tolerance: 0.00001,
						}),
						{
							iterations: 3,
						},
					).features[0],
				)

				return actions.mergeInto(cleanShape)
			}
			// other shape has no overlap with this one, leave it as is
		},
		fastModeShapes,
	)
}
