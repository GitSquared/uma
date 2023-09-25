import ComputedFogShape from '@lib/entities/ComputedFogShape'
import ComputedWalkTrace from '@lib/entities/ComputedWalkTrace'
import ThreadBridgeEventBus from '@lib/services/web-worker/thread-bridge'
import dataSource from '@lib/utils/data-source'
import * as turf from '@turf/turf'
import { ThreadedFnName } from '@web-worker/functions'

import { snapTraceToRoad } from './internal/map-matching'
import {
	getNextTracingCrawlerState,
	getPreviousPointInHistory,
} from './internal/queries'
import { shouldDrawLine, shouldDrawPoint } from './internal/sanity-checks'
import {
	expandOrCreateTrace,
	mergeComputedTraceGeometries,
} from './internal/trace-geometry'
import {
	FogShapeGeometries,
	TracedGeometry,
	WalkTraceGeometries,
} from './types'

// Roger the Crawler
// Crawls the GPS trace history and computes one more round of derived data
// returns true if there are more points to trace
// keep in mind: the crawler runs in reverse chronological order,
// tracing and expanding traces from the present to the past.
// cf. README for architecture and nomenclature
export default async function crawlTrace(
	workerThread: ThreadBridgeEventBus,
): Promise<{
	moreWorkAhead: boolean // more points to trace
	cursorTime?: Date // how far back in time the crawler was just working
}> {
	console.group('crawlTrace: start')
	console.time('crawlTrace')

	try {
		// TARGET
		console.time('crawlTrace: query')
		const nextTraceState = await getNextTracingCrawlerState()

		if (!nextTraceState) {
			console.info('crawlTrace: no more points to trace')
			console.timeEnd('crawlTrace: query')
			console.timeEnd('crawlTrace')
			console.groupEnd()
			return { moreWorkAhead: false }
		}

		const {
			latestUntracedPoint,

			lastComputedFogShape,
			nextComputedFogShape,
			lastComputedWalkTrace,
			nextComputedWalkTrace,
		} = nextTraceState

		// Used to expand from future computed data
		const nextLatestPoint = lastComputedFogShape?.earliestPoint

		// Used for merging to next computed data in reverse-chronological order
		const previousPointInHistory = await getPreviousPointInHistory(
			latestUntracedPoint,
		)

		console.timeEnd('crawlTrace: query')
		// TRACE

		console.time('crawlTrace: trace')

		let fogShape: FogShapeGeometries
		let walkTrace: WalkTraceGeometries

		if (!shouldDrawPoint(latestUntracedPoint)) {
			console.warn(
				'crawlTrace: latest untraced point does not pass sanity checks',
			)

			// Fake draw
			fogShape = lastComputedFogShape?.geojson ?? turf.featureCollection([])
			walkTrace = lastComputedWalkTrace?.geojson ?? turf.featureCollection([])
		} else {
			let newTracedGeometry: TracedGeometry

			if (
				nextLatestPoint &&
				shouldDrawLine(latestUntracedPoint, nextLatestPoint)
			) {
				const snappedTrace = await snapTraceToRoad([
					latestUntracedPoint,
					nextLatestPoint,
				])
				newTracedGeometry =
					snappedTrace ??
					turf.lineString([
						[latestUntracedPoint.longitude, latestUntracedPoint.latitude],
						[nextLatestPoint.longitude, nextLatestPoint.latitude],
					])
			} else {
				newTracedGeometry = turf.point([
					latestUntracedPoint.longitude,
					latestUntracedPoint.latitude,
				])
			}

			// EXPAND OR CREATE

			console.time('crawlTrace: expand geometries')

			fogShape = await workerThread.waitFor(
				workerThread.submitJobRequest(ThreadedFnName.ExpandOrCreateFog, [
					newTracedGeometry,
					lastComputedFogShape?.geojson,
				]),
			)

			walkTrace = expandOrCreateTrace(
				newTracedGeometry,
				lastComputedWalkTrace?.geojson,
			)

			console.timeEnd('crawlTrace: expand geometries')
		}

		const justDrawnPoint = latestUntracedPoint

		// WRITE TEMPORARY NEW STATE

		let justDrawnFogShape: ComputedFogShape

		if (lastComputedFogShape) {
			lastComputedFogShape.geojson = fogShape
			// We're walking backwards in history
			lastComputedFogShape.earliestPoint = justDrawnPoint

			justDrawnFogShape = lastComputedFogShape
		} else {
			const newComputedFogShape = new ComputedFogShape()
			newComputedFogShape.geojson = fogShape
			newComputedFogShape.earliestPoint = justDrawnPoint
			newComputedFogShape.latestPoint = justDrawnPoint

			justDrawnFogShape = newComputedFogShape
		}

		let justDrawnWalkTrace: ComputedWalkTrace

		if (lastComputedWalkTrace) {
			lastComputedWalkTrace.geojson = walkTrace
			lastComputedWalkTrace.earliestPoint = justDrawnPoint

			justDrawnWalkTrace = lastComputedWalkTrace
		} else {
			const newComputedWalkTrace = new ComputedWalkTrace()
			newComputedWalkTrace.geojson = walkTrace
			newComputedWalkTrace.earliestPoint = justDrawnPoint
			newComputedWalkTrace.latestPoint = justDrawnPoint

			justDrawnWalkTrace = newComputedWalkTrace
		}

		console.timeEnd('crawlTrace: trace')

		// MERGE
		// TODO: move from using tracing time to using geographical proximity to find geometries to merge

		console.time('crawlTrace: merge geometries')

		let hasMergedFogShapes = false
		let hasMergedWalkTraces = false

		if (previousPointInHistory) {
			// draw a joining line between the two geometries if needed
			let joiningGeometry: TracedGeometry | undefined = undefined
			if (shouldDrawLine(previousPointInHistory, justDrawnPoint)) {
				const snappedTrace = await snapTraceToRoad([
					previousPointInHistory,
					latestUntracedPoint,
				])
				joiningGeometry =
					snappedTrace ??
					turf.lineString([
						[previousPointInHistory.longitude, previousPointInHistory.latitude],
						[justDrawnPoint.longitude, justDrawnPoint.latitude],
					])
			}

			if (nextComputedFogShape) {
				if (previousPointInHistory.id === nextComputedFogShape.latestPoint.id) {
					if (joiningGeometry) {
						const joinedFogShape = await workerThread.waitFor(
							workerThread.submitJobRequest(ThreadedFnName.ExpandOrCreateFog, [
								joiningGeometry,
								justDrawnFogShape.geojson,
							]),
						)

						justDrawnFogShape.geojson = joinedFogShape
					}

					// then the last computed fog shape is going to "eat" the next one
					// so that they are merged into one

					const mergedFogShape = await workerThread.waitFor(
						workerThread.submitJobRequest(ThreadedFnName.MergeFogGeometries, [
							justDrawnFogShape.geojson,
							nextComputedFogShape.geojson,
						]),
					)

					justDrawnFogShape.geojson = mergedFogShape
					justDrawnFogShape.earliestPoint = nextComputedFogShape.earliestPoint

					// this marks the next computed fog shape as now redundant and ready to be deleted
					hasMergedFogShapes = true
				}
			}

			if (nextComputedWalkTrace) {
				// same but for walk traces
				if (
					previousPointInHistory.id === nextComputedWalkTrace.latestPoint.id
				) {
					if (joiningGeometry) {
						const joinedTrace = expandOrCreateTrace(
							joiningGeometry,
							justDrawnWalkTrace.geojson,
						)

						justDrawnWalkTrace.geojson = joinedTrace
					}

					const mergedTrace = mergeComputedTraceGeometries(
						justDrawnWalkTrace.geojson,
						nextComputedWalkTrace.geojson,
					)

					justDrawnWalkTrace.geojson = mergedTrace
					justDrawnWalkTrace.earliestPoint = nextComputedWalkTrace.earliestPoint

					hasMergedWalkTraces = true
				}
			}
		}

		console.timeEnd('crawlTrace: merge geometries')

		// COMMIT

		console.time('crawlTrace: write new state')

		await dataSource
			.transaction(async (entityManager) => {
				if (hasMergedFogShapes) {
					// the next computed fog shape is now merged into the last one
					await entityManager.remove(nextComputedFogShape)
				}
				await entityManager.save(justDrawnFogShape)

				if (hasMergedWalkTraces) {
					await entityManager.remove(nextComputedWalkTrace)
				}
				await entityManager.save(justDrawnWalkTrace)
			})
			.catch((error) => {
				console.error('crawlTrace: error saving new state', error)
			})

		console.timeEnd('crawlTrace: write new state')

		console.timeEnd('crawlTrace')
		console.groupEnd()

		return {
			moreWorkAhead: true,
			cursorTime: justDrawnPoint.timestamp,
		}
	} catch (error) {
		console.error('crawlTrace: error', error)
	}

	return {
		moreWorkAhead: true,
	}
}
