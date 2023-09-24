import {
	actionColor,
	actionTranslucentBackgroundColor,
} from '@lib/components/generic/styles'
import Text from '@lib/components/generic/Text'
import LocationPoint from '@lib/entities/LocationPoint'
import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { FOG_CLEARING_RADIUS_METERS } from '@lib/services/tracing-crawler/consts'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import MapboxGL from '@rnmapbox/maps'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LessThanOrEqual } from 'typeorm'

enum PointsLayerIds {
	Source = 'pointsSource',
	Layer = 'pointsLayer',
}

interface PointToRender {
	id: string
	timestamp: Date
	latitude: number
	longitude: number
	altitude?: number
	accuracy?: number
	speed?: number
	heading?: number

	geoJsonFeature: GeoJSON.Feature<GeoJSON.Point>
}

const DEFAULT_RADIUS = 10

const basePointsLayerStyle = {
	circleColor: actionTranslucentBackgroundColor,
	circleOpacity: 1,
	circleStrokeWidth: 2.5,
	circleStrokeColor: actionColor,
}

export default function PointsLayer() {
	const [showDebugView] = useSetting(UserSettingKey.DebugView)

	const [points, setPoints] = useState<PointToRender[]>([])

	const updateLatestPoints = useCallback(() => {
		void LocationPoint.find({
			order: { timestamp: 'DESC' },
			where: [
				{
					accuracy: undefined,
				},
				{ accuracy: LessThanOrEqual(FOG_CLEARING_RADIUS_METERS) },
			],
			take: 400,
		}).then((points) => {
			const pointsToRender: PointToRender[] = []

			for (const point of points) {
				const feature: GeoJSON.Feature<GeoJSON.Point> = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [point.longitude, point.latitude],
					},
					properties: {
						id: point.id,
					},
				}

				pointsToRender.push({
					...point,
					geoJsonFeature: feature,
				})
			}

			setPoints(pointsToRender)
		})
	}, [])

	useEffect(() => {
		if (!showDebugView) return

		updateLatestPoints()

		const listenerId = getAppWideEventsEmitter().on(
			AppWideEvents.NewRecordedData,
			() => {
				updateLatestPoints()
			},
		)

		return () => {
			getAppWideEventsEmitter().unsubscribe(
				AppWideEvents.NewRecordedData,
				listenerId,
			)
		}
	}, [showDebugView, updateLatestPoints])

	return (
		<>
			{points.map((point) => {
				const sourceId = PointsLayerIds.Source + '-point-' + point.id

				const radiusInMeters = point.accuracy || DEFAULT_RADIUS

				const pointLayerStyle = {
					...basePointsLayerStyle,
					circleRadius: [
						'interpolate',
						['exponential', 2],
						['zoom'],
						0,
						Math.max(radiusInMeters / 78271.484, 1),
						8,
						Math.max(radiusInMeters / 305.748, 1),
						16,
						Math.max(radiusInMeters / 1.194, 1),
						22,
						radiusInMeters / 0.019,
					],

					visibility: showDebugView ? 'visible' : 'none',
				}

				return (
					<MapboxGL.ShapeSource
						key={point.id}
						id={sourceId}
						shape={{
							type: 'FeatureCollection',
							features: [point.geoJsonFeature],
						}}
					>
						<MapboxGL.CircleLayer
							id={PointsLayerIds.Layer + '-point-' + point.id}
							style={pointLayerStyle}
							layerIndex={47}
						/>
						{showDebugView ? (
							<MapboxGL.MarkerView
								id={PointsLayerIds.Layer + '-point-' + point.id + '-info'}
								coordinate={[point.longitude, point.latitude]}
							>
								<View>
									<Text variant="numeric" size={12} style={styles.infoboxText}>
										{point.id.split('-')[0]}
										{'\n'}
										{point.timestamp.toLocaleString()}
										{'\n'}
										accuracy: {point.accuracy}m{'\n'}
										heading: {point.heading?.toFixed(2)}°{'\n'}
										altitude: {point.altitude?.toFixed(2)}m{'\n'}
										speed: {point.speed?.toFixed(2)} km/h
									</Text>
								</View>
							</MapboxGL.MarkerView>
						) : (
							<></>
						)}
					</MapboxGL.ShapeSource>
				)
			})}
		</>
	)
}

const styles = StyleSheet.create({
	infoboxText: {
		textAlign: 'center',
	},
})
