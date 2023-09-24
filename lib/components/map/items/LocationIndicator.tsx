import MapboxGL from '@rnmapbox/maps'
import { useEffect, useState } from 'react'

import { makeMetersToPixelZoomInterpolation } from '../utils'

export enum LocationIndicatorLayerIds {
	AccuracyLayer = 'userLocationAccuracy',
	HeadingLayer = 'userLocationHeading',
}

const accuracyCircleStyle = {
	circleColor: 'rgba(46, 116, 252, 0.1)',
	circlePitchAlignment: 'map',
	circleStrokeWidth: 0.7,
	circleStrokeColor: 'rgba(46, 116, 252, 0.4)',
}

const userLocationHeadingSymbolStyle = {
	symbolPlacement: 'point',
	iconPitchAlignment: 'map',
	iconRotationAlignment: 'map',
	iconAllowOverlap: true,
	iconIgnorePlacement: true,
	iconImage: 'userLocationHeadingIcon',
	iconSize: 0.55,
	symbolSortKey: 100,
}

export default function LocationIndicator() {
	const locationHeadingIcon =
		require('@assets/icons/location-heading.png') as number

	const [location, setLocation] = useState<MapboxGL.Location['coords']>({
		latitude: 90,
		longitude: -90,
		heading: 0,
		accuracy: 0,
	})

	useEffect(() => {
		const listener = (location: MapboxGL.Location) => {
			setLocation(location.coords)
		}

		MapboxGL.locationManager.addListener(listener)

		return () => {
			MapboxGL.locationManager.removeListener(listener)
		}
	}, [])

	return (
		<MapboxGL.UserLocation
			renderMode={MapboxGL.UserLocationRenderMode.Normal}
			minDisplacement={3}
			animated
		>
			<MapboxGL.Images
				images={{
					userLocationHeadingIcon: locationHeadingIcon,
				}}
			/>
			<MapboxGL.CircleLayer
				id={LocationIndicatorLayerIds.AccuracyLayer}
				style={{
					...accuracyCircleStyle,
					circleRadius: makeMetersToPixelZoomInterpolation(
						Math.max(location.accuracy || 20, 20),
					),
				}}
				layerIndex={49}
			/>
			<MapboxGL.SymbolLayer
				id={LocationIndicatorLayerIds.HeadingLayer}
				style={{
					...userLocationHeadingSymbolStyle,
					iconRotate: location.heading,
				}}
				layerIndex={51}
			/>
		</MapboxGL.UserLocation>
	)
}
