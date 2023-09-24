import { springConfig } from '@lib/components/generic/PressableSpring'
import { MapRef } from '@lib/components/map/Map'
import { useCallback, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'

import LocationIcon from '../generic/icons/Location'
import {
	actionColor,
	actionTranslucentBackgroundColor,
} from '../generic/styles'

interface CenterCurrentLocationButtonProps {
	mapRef: React.RefObject<MapRef>
}

export default function CenterCurrentLocationButton({
	mapRef,
}: CenterCurrentLocationButtonProps) {
	const centerOnCurrentLocation = useCallback(() => {
		void mapRef.current?.toggleFollowUserLocation()
	}, [mapRef])

	const [pressed, setPressed] = useState(false)

	const backgroundSize = useSharedValue(42)

	if (pressed) {
		backgroundSize.value = 38
	} else {
		backgroundSize.value = 42
	}

	const iconBackgroundStyle = useAnimatedStyle(() => ({
		height: withSpring(backgroundSize.value, springConfig),
		width: withSpring(backgroundSize.value, springConfig),
		left: withSpring((42 - backgroundSize.value) / 2, springConfig),
		top: withSpring((42 - backgroundSize.value) / 2, springConfig),
	}))

	return (
		<Pressable
			onPress={centerOnCurrentLocation}
			onPressIn={() => {
				setPressed(true)
			}}
			onPressOut={() => {
				setPressed(false)
			}}
			style={styles.iconContainer}
		>
			<Animated.View
				style={[styles.iconButtonBackground, iconBackgroundStyle]}
			/>
			<LocationIcon size={42} color={actionColor} pressed={pressed} />
		</Pressable>
	)
}

const styles = StyleSheet.create({
	iconButtonBackground: {
		backgroundColor: actionTranslucentBackgroundColor,
		borderRadius: 360,
		height: 42,
		left: 0,
		position: 'absolute',
		top: 0,
		width: 42,
	},
	iconContainer: {
		alignItems: 'center',
		height: 42,
		justifyContent: 'center',
		width: 42,
	},
})
