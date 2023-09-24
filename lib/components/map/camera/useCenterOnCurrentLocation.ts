import { CameraStop } from '@rnmapbox/maps/lib/typescript/components/Camera'
import * as Location from 'expo-location'
import { RefObject, useCallback } from 'react'

import type { ExtendedCameraRef } from '../types'

export type CenterOnCurrentLocationFn = (
	animation?: boolean,
	animationDuration?: number,
) => Promise<Location.LocationObject>

export default function useCenterOnCurrentLocation(
	cameraRef: RefObject<ExtendedCameraRef>,
) {
	return useCallback<CenterOnCurrentLocationFn>(
		async (animation = true, animationDuration = 500) => {
			const location = await Location.getLastKnownPositionAsync()
			if (!location) throw new Error('No location available')

			const camera = cameraRef.current
			if (!camera) throw new Error('No camera available')

			const animationProps: CameraStop = animation
				? {
						animationDuration,
						animationMode: 'flyTo',
				  }
				: {
						animationDuration: 0,
						animationMode: 'none',
				  }
			camera.setCamera({
				centerCoordinate: [location.coords.longitude, location.coords.latitude],
				zoomLevel: 16,
				...animationProps,
			})
			if (animation) {
				camera.runningAnimation = true
				return new Promise((resolve) => {
					setTimeout(() => {
						camera.runningAnimation = false
						resolve(location)
					}, animationProps.animationDuration)
				})
			}
			return location
		},
		[cameraRef],
	)
}
