import LocationPoint from '@lib/entities/LocationPoint'
import type { CameraStop } from '@rnmapbox/maps/lib/typescript/components/Camera'
import { RefObject, useCallback } from 'react'

import type { ExtendedCameraRef } from '../types'

export type CenterOnLastPointFn = (animation?: boolean) => Promise<void>

export default function useCenterOnLastPoint(
	cameraRef: RefObject<ExtendedCameraRef>,
) {
	return useCallback<CenterOnLastPointFn>(
		async (animation = true) => {
			const point = await LocationPoint.findOne({
				order: { timestamp: 'DESC' },
			})

			if (!point) throw new Error('No point available')

			const camera = cameraRef.current
			if (!camera) throw new Error('No camera available')

			const animationProps: CameraStop = animation
				? {
						animationDuration: 500,
						animationMode: 'flyTo',
				  }
				: {
						animationDuration: 0,
						animationMode: 'none',
				  }
			camera.setCamera({
				centerCoordinate: [point.longitude, point.latitude],
				zoomLevel: 16,
				...animationProps,
			})
			if (animation) {
				camera.runningAnimation = true
				setTimeout(() => {
					camera.runningAnimation = false
				}, animationProps.animationDuration)
			}
		},
		[cameraRef],
	)
}
