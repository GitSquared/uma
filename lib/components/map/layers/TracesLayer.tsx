import {
	foregroundColor,
	traceColor,
	traceStrokeColor,
} from '@lib/components/generic/styles'
import ComputedWalkTrace from '@lib/entities/ComputedWalkTrace'
import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import MapboxGL from '@rnmapbox/maps'
import * as turf from '@turf/turf'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { makeMetersToPixelZoomInterpolation } from '../utils'

enum TracesLayerIds {
	Source = 'tracesSource',
	Layer = 'tracesLayer',
}

const widthInMeters = 12.5
const strokeWidthInMeters = 4

const tracesLayerStyle = {
	lineColor: traceColor,
	lineWidth: makeMetersToPixelZoomInterpolation(widthInMeters),
	lineCap: 'round',
	lineJoin: 'round',
	lineOpacity: 1,
}
const tracesStrokeLayerStyle = {
	lineColor: traceStrokeColor,
	lineWidth: makeMetersToPixelZoomInterpolation(
		widthInMeters + strokeWidthInMeters * 2,
	),
	lineCap: 'round',
	lineJoin: 'round',
	lineOpacity: 1,
}

const tracesTrackingOffStyle = {
	lineColor: foregroundColor,
}

export default function TracesLayer() {
	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)

	const [latestWalkTraces, setLatestWalkTraces] = useState<ComputedWalkTrace[]>(
		[],
	)

	const updateLatestWalkTraces = useCallback(() => {
		void ComputedWalkTrace.createQueryBuilder()
			.leftJoinAndSelect('ComputedWalkTrace.latestPoint', 'latestPoint')
			.orderBy('latestPoint.timestamp', 'DESC')
			.limit(300)
			.getMany()
			.then(setLatestWalkTraces)
	}, [])

	useEffect(() => {
		const listenerId = getAppWideEventsEmitter().on(
			AppWideEvents.NewComputedWalkTrace,
			() => {
				updateLatestWalkTraces()
			},
		)

		updateLatestWalkTraces()

		return () => {
			getAppWideEventsEmitter().unsubscribe(
				AppWideEvents.NewComputedWalkTrace,
				listenerId,
			)
		}
	}, [updateLatestWalkTraces])

	const geoJsonFeatureCollection = useMemo<
		GeoJSON.FeatureCollection<GeoJSON.LineString>
	>(() => {
		const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> =
			turf.featureCollection([])

		for (const walkTrace of latestWalkTraces) {
			geojson.features.push(...walkTrace.geojson.features)
		}

		return geojson
	}, [latestWalkTraces])

	return (
		<MapboxGL.ShapeSource
			id={TracesLayerIds.Source}
			shape={geoJsonFeatureCollection}
		>
			<MapboxGL.LineLayer
				id={TracesLayerIds.Layer + '-stroke'}
				sourceID={TracesLayerIds.Source}
				style={{
					...tracesStrokeLayerStyle,
					...(batterySaver ? tracesTrackingOffStyle : {}),
				}}
				layerIndex={40}
			/>
			<MapboxGL.LineLayer
				id={TracesLayerIds.Layer}
				sourceID={TracesLayerIds.Source}
				style={{
					...tracesLayerStyle,
					...(batterySaver ? tracesTrackingOffStyle : {}),
				}}
				layerIndex={41}
			/>
		</MapboxGL.ShapeSource>
	)
}
