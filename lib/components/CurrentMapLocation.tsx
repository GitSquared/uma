import Text from '@lib/components/generic/Text'
import { MapRef } from '@lib/components/map/Map'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { RefObject, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Geocoder, { GeocodingObject } from 'react-native-geocoder-reborn'

import { backgroundColor, highlightColor } from './generic/styles'

type Position = [number, number]

async function getPlaceName(coords: Position, zoom: number): Promise<string> {
	const types: (keyof GeocodingObject)[] = []

	if (zoom < 2) {
		return 'HOME'
	}
	if (zoom >= 2) {
		types.push('country')
	}
	if (zoom >= 5) {
		types.push('adminArea')
	}
	if (zoom >= 8) {
		types.push('subAdminArea')
	}
	if (zoom >= 11) {
		types.push('locality')
	}
	if (zoom >= 14) {
		types.push('subLocality')
	}

	Geocoder.setLanguage('en')
	const reverseGeocodingResult = await Geocoder.geocodePosition({
		lng: coords[0],
		lat: coords[1],
	})

	let locationName: string | null = null

	for (const type of types) {
		const potentialName = reverseGeocodingResult[0]?.[type]
		if (typeof potentialName === 'string') {
			locationName = potentialName
		}
	}

	if (!locationName) throw new Error('Location name not found')

	return locationName
}

interface CurrentMapLocationProps {
	mapRef: RefObject<MapRef>
}

export default function CurrentMapLocation({
	mapRef,
}: CurrentMapLocationProps) {
	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)
	const [currentMapLocationName, setCurrentMapLocationName] = useState<
		string | null
	>(null)

	useEffect(() => {
		const map = mapRef.current
		if (!map) return

		// TODO: listen to events from the map instead of polling
		const refresher = setInterval(() => {
			void (async () => {
				try {
					const [center, zoom] = await Promise.all([
						mapRef.current?.getCenter(),
						mapRef.current?.getZoom(),
					])
					if (!center || !zoom) return
					const coords: Position = [center[0], center[1]]

					const locationName = await getPlaceName(coords, zoom)
					setCurrentMapLocationName(locationName)
				} catch (error) {
					// map not ready or API error
					setCurrentMapLocationName(null)
				}
			})()
		}, 2000)
		return () => {
			clearInterval(refresher)
		}
	}, [mapRef, setCurrentMapLocationName])

	return (
		<View style={styles.currentMapLocationContainer} pointerEvents="box-none">
			<Text
				size={48}
				variant="wild"
				style={{
					...styles.currentLocationText,
					color: batterySaver ? backgroundColor : highlightColor,
				}}
			>
				{currentMapLocationName || 'looking...'}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	currentLocationText: {
		flexWrap: 'wrap',
		lineHeight: 50,
		textAlign: 'center',
	},
	currentMapLocationContainer: {
		alignItems: 'center',
		flexDirection: 'column',
		maxHeight: 200,
		paddingHorizontal: 12,
		width: '100%',
	},
})
