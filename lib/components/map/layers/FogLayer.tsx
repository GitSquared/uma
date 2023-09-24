import { fogColor, fogNoTrackingColor } from '@lib/components/generic/styles'
import ComputedFogShape from '@lib/entities/ComputedFogShape'
import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { WHOLE_WORLD_GEOJSON_POLYGON } from '@lib/services/tracing-crawler/internal/geo-json-utils'
import useWebWorkerThread from '@lib/services/web-worker/useWebWorkerThread'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import MapboxGL from '@rnmapbox/maps'
import * as turf from '@turf/turf'
import { ThreadedFnName } from '@web-worker/functions'
import { useCallback, useEffect, useState } from 'react'

export enum FogLayerIds {
	Source = 'fogSource',
	Layer = 'fogLayer',
}

const fogLayerStyle = {
	fillColor: fogColor,
	fillOutlineColor: fogColor,
	fillOpacity: 0.8,
	fillAntialias: true,
}

const fogTrackingOffStyle = {
	fillColor: fogNoTrackingColor,
}

export default function FogLayer() {
	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)
	const [showFog] = useSetting(UserSettingKey.Fog)

	const visibility = showFog ? 'visible' : 'none'

	const [latestFogShapes, setLatestFogShapes] = useState<ComputedFogShape[]>([])

	const updateLatestFogShapes = useCallback(() => {
		void ComputedFogShape.createQueryBuilder()
			.leftJoinAndSelect('ComputedFogShape.latestPoint', 'latestPoint')
			.orderBy('latestPoint.timestamp', 'DESC')
			.limit(300)
			.getMany()
			.then(setLatestFogShapes)
	}, [])

	useEffect(() => {
		const listenerId = getAppWideEventsEmitter().on(
			AppWideEvents.NewComputedFogShape,
			() => {
				updateLatestFogShapes()
			},
		)

		updateLatestFogShapes()

		return () => {
			getAppWideEventsEmitter().unsubscribe(
				AppWideEvents.NewComputedFogShape,
				listenerId,
			)
		}
	}, [updateLatestFogShapes])

	const [fogLayerGeoJson, setFogLayerGeoJson] = useState<
		GeoJSON.FeatureCollection<GeoJSON.Polygon>
	>(turf.featureCollection([WHOLE_WORLD_GEOJSON_POLYGON]))

	const webWorkerThread = useWebWorkerThread()

	useEffect(() => {
		if (!webWorkerThread) return

		console.time('Render fog mask')
		const jobEventName = webWorkerThread.submitJobRequest(
			ThreadedFnName.RenderFogMask,
			latestFogShapes.map((shape) => shape.geojson),
		)

		let gotResult = false

		const listenerId = webWorkerThread.once(jobEventName, (output) => {
			gotResult = true
			console.timeEnd('Render fog mask')
			setFogLayerGeoJson(output)
		})

		return () => {
			if (!gotResult) {
				console.timeEnd('Render fog mask')
				webWorkerThread.unsubscribe(jobEventName, listenerId)
			}
		}
	}, [latestFogShapes, webWorkerThread])

	return (
		<MapboxGL.ShapeSource id={FogLayerIds.Source} shape={fogLayerGeoJson}>
			<MapboxGL.FillLayer
				id={FogLayerIds.Layer}
				style={{
					...fogLayerStyle,
					...(batterySaver ? fogTrackingOffStyle : {}),
					visibility,
				}}
				layerIndex={42}
			/>
		</MapboxGL.ShapeSource>
	)
}
