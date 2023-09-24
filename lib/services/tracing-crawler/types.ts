import type ComputedFogShape from '@lib/entities/ComputedFogShape'
import type ComputedWalkTrace from '@lib/entities/ComputedWalkTrace'

export type TracedGeometry = GeoJSON.Feature<GeoJSON.Point | GeoJSON.LineString>

export type FogShapeGeometry = ComputedFogShape['geojson']['features'][0]
export type FogShapeGeometries = ComputedFogShape['geojson']

export type WalkTraceGeometry = ComputedWalkTrace['geojson']['features'][0]
export type WalkTraceGeometries = ComputedWalkTrace['geojson']

export interface TracingCrawlerService {
	isCrawlerRunning: boolean
	lastCrawlCursorTime?: Date
}
