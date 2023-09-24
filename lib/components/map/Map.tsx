import { backgroundColor } from '@lib/components/generic/styles'
import useCenterOnCurrentLocation, {
	CenterOnCurrentLocationFn,
} from '@lib/components/map/camera/useCenterOnCurrentLocation'
import useCenterOnLastPoint, {
	CenterOnLastPointFn,
} from '@lib/components/map/camera/useCenterOnLastPoint'
import useFollowUserLocation, {
	ToggleFollowUserLocationFn,
} from '@lib/components/map/camera/useFollowUserLocation'
import { ExtendedCameraRef } from '@lib/components/map/types'
import LocationPoint from '@lib/entities/LocationPoint'
import { isPoint } from '@lib/services/tracing-crawler/internal/geo-json-utils'
import config from '@lib/utils/config'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import MapboxGL from '@rnmapbox/maps'
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

void MapboxGL.setAccessToken(config?.mapboxAccessToken as string)

const MAP_STYLE_URL = 'mapbox://styles/squared/cl6cbyd8a000j15s0ot8x12j2'
const MAP_STYLE_URL_DISABLED =
	'mapbox://styles/squared/clkefmvy9003d01qyaebzhnnn'

export interface MapRef {
	centerOnLastPoint: CenterOnLastPointFn
	centerOnCurrentLocation: CenterOnCurrentLocationFn
	toggleFollowUserLocation: ToggleFollowUserLocationFn
	getCenter: () => Promise<[number, number]>
	getZoom: () => Promise<number>
}

interface MapProps {
	children?: React.ReactNode
}

export default forwardRef<MapRef, MapProps>(function Map(
	{ children }: MapProps,
	ref,
) {
	useLayoutEffect(() => {
		if (typeof MapboxGL.setTelemetryEnabled === 'function') {
			MapboxGL.setTelemetryEnabled(false)
		}
	}, [])

	const mapRef = useRef<MapboxGL.MapView>(null)
	const cameraRef = useRef<ExtendedCameraRef>(null)

	const centerOnLastPoint = useCenterOnLastPoint(cameraRef)
	const centerOnCurrentLocation = useCenterOnCurrentLocation(cameraRef)

	const {
		toggleFollowUserLocation,
		currentlyFollowingUser,
		followingCameraProps,
	} = useFollowUserLocation(centerOnCurrentLocation)

	const [cameraIsPitched, setCameraIsPitched] = useState(false)

	const getCenter = useCallback<MapRef['getCenter']>(async () => {
		if (!mapRef.current) throw new Error('Map not ready')

		const center = await mapRef.current.getCenter()

		if (typeof center[0] !== 'number' || typeof center[1] !== 'number')
			throw new Error('Coordinates not ready')

		return [center[0], center[1]]
	}, [mapRef])

	const getZoom = useCallback<MapRef['getZoom']>(async () => {
		if (!mapRef.current) throw new Error('Map not ready')

		const zoom = await mapRef.current.getZoom()

		return zoom
	}, [mapRef])

	useImperativeHandle(
		ref,
		() => ({
			centerOnLastPoint,
			centerOnCurrentLocation,
			getCenter,
			getZoom,
			toggleFollowUserLocation,
		}),
		[
			centerOnLastPoint,
			centerOnCurrentLocation,
			getCenter,
			getZoom,
			toggleFollowUserLocation,
		],
	)

	// automatically recenter on current location when map is ready
	const [hasCenteredAtBootstrap, setHasCenteredAtBootstrap] = useState(false)
	const centerOnCurrentLocationAtBootstrap = useCallback(() => {
		if (hasCenteredAtBootstrap || !cameraRef.current) return

		void centerOnCurrentLocation(true, 2000)
		setHasCenteredAtBootstrap(true)
	}, [hasCenteredAtBootstrap, centerOnCurrentLocation])

	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)
	const [debugMode] = useSetting(UserSettingKey.DebugView)
	const [debugWriteMode] = useSetting(UserSettingKey.DebugWriteMode)

	return (
		<View style={styles.container}>
			<MapboxGL.MapView
				ref={mapRef}
				style={styles.map}
				projection="globe"
				attributionEnabled={false}
				logoEnabled={false}
				scaleBarEnabled={false}
				styleURL={batterySaver ? MAP_STYLE_URL_DISABLED : MAP_STYLE_URL}
				rotateEnabled={false}
				pitchEnabled={false}
				scrollEnabled
				onLayout={() => {
					centerOnCurrentLocationAtBootstrap()
				}}
				zoomEnabled
				onTouchMove={() => {
					if (currentlyFollowingUser) {
						void toggleFollowUserLocation(false)
						if (!cameraIsPitched) {
							setCameraIsPitched(true)
						}
					}
				}}
				onTouchEnd={() => {
					if (!currentlyFollowingUser && cameraRef.current && cameraIsPitched) {
						cameraRef.current.setCamera({
							pitch: 0,
							heading: 0,
							animationMode: 'easeTo',
							animationDuration: 500,
						})
						setCameraIsPitched(false)
					}
				}}
				onPress={(event) => {
					if (debugMode && debugWriteMode && isPoint(event)) {
						const coordinates = event.geometry.coordinates

						const point = new LocationPoint()
						point.longitude = coordinates[0]
						point.latitude = coordinates[1]
						point.accuracy = 34
						point.speed = 0
						point.altitude = 123
						point.heading = 0
						void point.save()
					}
				}}
			>
				<MapboxGL.Camera
					ref={cameraRef}
					defaultSettings={{
						centerCoordinate: [0, 0],
						zoomLevel: 0,
						pitch: 0,
						heading: 0,
					}}
					minZoomLevel={0}
					maxZoomLevel={18}
					{...followingCameraProps}
				/>

				{children}
			</MapboxGL.MapView>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor,
		height: '100%',
		width: '100%',
	},
	map: {
		flex: 1,
	},
})
