import ComputedFogShape from '@lib/entities/ComputedFogShape'
import ComputedWalkTrace from '@lib/entities/ComputedWalkTrace'
import LocationPoint from '@lib/entities/LocationPoint'
import { LessThanOrEqual } from 'typeorm'

interface NextTracingCrawlerState {
	// The point to trace
	latestUntracedPoint: LocationPoint
	// The last geometries to expand, if any (towards present)
	lastComputedFogShape?: ComputedFogShape
	lastComputedWalkTrace?: ComputedWalkTrace
	// The next geometries to merge into, if any (towards past)
	nextComputedFogShape?: ComputedFogShape
	nextComputedWalkTrace?: ComputedWalkTrace
}

const FETCH_BATCH_SIZE = 30

interface BatchedFetchedData {
	locationPoints: LocationPoint[]
	locationPointsCount: number
	fogShapes: ComputedFogShape[]
	fogShapesCount: number
	walkTraces: ComputedWalkTrace[]
	walkTracesCount: number
}

async function fetchBatchedData(
	cursorTimestamp: Date,
	take: number,
): Promise<BatchedFetchedData> {
	const locationPointsQuery = LocationPoint.createQueryBuilder()
		.where('LocationPoint.timestamp < :cursorTimestamp', { cursorTimestamp })
		.orderBy('LocationPoint.timestamp', 'DESC')
		.take(take)
		.getManyAndCount()

	const fogShapesQuery = ComputedFogShape.createQueryBuilder()
		.leftJoinAndSelect('ComputedFogShape.earliestPoint', 'earliestPoint')
		.leftJoinAndSelect('ComputedFogShape.latestPoint', 'latestPoint')
		.where('latestPoint.timestamp < :cursorTimestamp', { cursorTimestamp })
		.orderBy('latestPoint.timestamp', 'DESC')
		.take(take)
		.getManyAndCount()

	const walkTracesQuery = ComputedWalkTrace.createQueryBuilder()
		.leftJoinAndSelect('ComputedWalkTrace.earliestPoint', 'earliestPoint')
		.leftJoinAndSelect('ComputedWalkTrace.latestPoint', 'latestPoint')
		.where('latestPoint.timestamp < :cursorTimestamp', { cursorTimestamp })
		.orderBy('latestPoint.timestamp', 'DESC')
		.take(take)
		.getManyAndCount()

	const [
		[locationPoints, locationPointsCount],
		[fogShapes, fogShapesCount],
		[walkTraces, walkTracesCount],
	] = await Promise.all([locationPointsQuery, fogShapesQuery, walkTracesQuery])

	return {
		locationPoints,
		locationPointsCount,
		fogShapes,
		fogShapesCount,
		walkTraces,
		walkTracesCount,
	}
}

export async function getNextTracingCrawlerState(): Promise<
	NextTracingCrawlerState | undefined
> {
	let cursorTimestamp: Date = new Date()
	let lastComputedFogShape: ComputedFogShape | undefined
	let lastComputedWalkTrace: ComputedWalkTrace | undefined

	// Loop until we find an untraced point or get to the end of the timeline
	let hasMoreData = true
	while (hasMoreData) {
		// Batch-query for more perf
		const {
			locationPoints,
			locationPointsCount,
			fogShapes,
			fogShapesCount,
			walkTraces,
		} = await fetchBatchedData(cursorTimestamp, FETCH_BATCH_SIZE)

		hasMoreData =
			fogShapesCount > FETCH_BATCH_SIZE ||
			locationPointsCount > FETCH_BATCH_SIZE

		if (!fogShapesCount) {
			// No more fog shapes are available
			// Pick the latest untraced point after cursor, if any
			// Otherwise, we're done

			const latestUntracedPoint = locationPoints.find(
				(point) => point.timestamp < cursorTimestamp,
			)
			if (latestUntracedPoint) {
				return {
					latestUntracedPoint,
					lastComputedFogShape,
				}
			}

			return
		}

		// TODO: use a proper, separate entity for time-based crawl indexing, rather than relying on ComputedFogShape arbitrarily
		let walkTracesIndex = 0
		for (const nextComputedFogShape of fogShapes) {
			const nextComputedWalkTrace = walkTraces[walkTracesIndex]
			walkTracesIndex++

			// Find the latest untraced point between cursor and next fog shape
			const latestUntracedPoint = locationPoints.find(
				(point) =>
					point.timestamp < cursorTimestamp &&
					point.timestamp > nextComputedFogShape.latestPoint.timestamp,
			)

			if (latestUntracedPoint) {
				return {
					latestUntracedPoint,

					lastComputedFogShape,
					nextComputedFogShape,

					lastComputedWalkTrace,
					nextComputedWalkTrace,
				}
			}

			cursorTimestamp = nextComputedFogShape.earliestPoint.timestamp

			lastComputedFogShape = nextComputedFogShape
			lastComputedWalkTrace = nextComputedWalkTrace
		}
	}
}

export async function getPreviousPointInHistory(
	fromPoint: LocationPoint,
): Promise<LocationPoint | undefined> {
	return (
		await LocationPoint.find({
			where: {
				timestamp: LessThanOrEqual(fromPoint.timestamp),
			},
			order: {
				timestamp: 'DESC',
			},
			skip: 1,
			take: 1,
		})
	).at(0)
}
