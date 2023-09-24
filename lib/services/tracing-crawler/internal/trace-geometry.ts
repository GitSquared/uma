import * as turf from '@turf/turf'

import {
	TracedGeometry,
	WalkTraceGeometries,
	WalkTraceGeometry,
} from '../types'
import { isLineString, isPoint, standardizeGeometry } from './geo-json-utils'

export function expandOrCreateTrace(
	newGeometry: TracedGeometry,
	previousTrace?: WalkTraceGeometries,
): WalkTraceGeometries {
	if (isPoint(newGeometry)) {
		// we need at least two points to create a trace!
		return previousTrace ?? turf.featureCollection([])
	}
	if (!isLineString(newGeometry)) {
		throw new Error(
			'expandOrCreateTrace: newGeometry is neither a point nor a lineString',
		)
	}

	// nothing to draw here, we want the linestring directly
	const newSegment: WalkTraceGeometry = standardizeGeometry(newGeometry)

	const newTrace: WalkTraceGeometries = turf.featureCollection([newSegment])

	if (previousTrace) {
		return mergeComputedTraceGeometries(previousTrace, newTrace)
	}

	return newTrace
}

export function mergeComputedTraceGeometries(
	traceA: WalkTraceGeometries, // most recent
	traceB: WalkTraceGeometries, // oldest
): WalkTraceGeometries {
	// unlike with fog shapes, we don't care about deduplicating traces that intersect,
	// we just want to join traces that follow up on each other
	const firstLineStringA = traceA.features.at(0)

	const lastLineStringB = traceB.features.at(-1)

	// Check if the starting point of traceB matches the ending point of traceA

	const firstPointA = firstLineStringA?.geometry.coordinates.at(0)
	const lastPointB = lastLineStringB?.geometry.coordinates.at(-1)

	if (
		firstLineStringA &&
		firstPointA &&
		lastLineStringB &&
		lastPointB &&
		firstPointA[0] === lastPointB[0] &&
		firstPointA[1] === lastPointB[1]
	) {
		// Merge the new segment with the previous trace's latest LineString
		lastLineStringB.geometry.coordinates.push(
			...firstLineStringA.geometry.coordinates.slice(1),
		)
		// Write merged segment back to trace object
		traceB.features[traceB.features.length - 1] = lastLineStringB
	} else if (firstLineStringA) {
		// Add the new LineString to the list of features of the previous trace
		traceB.features.push(firstLineStringA)
	}

	// Add the remaining features from traceA to traceB
	traceB.features.push(...traceA.features.slice(1))

	return { ...traceB }
}
