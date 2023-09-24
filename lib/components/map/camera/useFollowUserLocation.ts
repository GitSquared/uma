import { UserTrackingMode } from '@rnmapbox/maps'
import { CameraProps } from '@rnmapbox/maps/lib/typescript/components/Camera'
import { useCallback, useState } from 'react'

export type ToggleFollowUserLocationFn = (follow?: boolean) => Promise<boolean>

export default function useFollowUserLocation(
	centerLastKnownLocation: () => Promise<unknown>,
): {
	toggleFollowUserLocation: ToggleFollowUserLocationFn
	currentlyFollowingUser: boolean
	followingCameraProps: Partial<CameraProps>
} {
	const [currentlyFollowingUser, setCurrentlyFollowingUser] = useState(false)
	const [cameraProps, setCameraProps] = useState<Partial<CameraProps>>({})

	const toggleFollowUserLocation = useCallback<ToggleFollowUserLocationFn>(
		async (forcedState) => {
			const follow = forcedState ?? !currentlyFollowingUser
			if (follow === currentlyFollowingUser) return follow

			if (follow) {
				await centerLastKnownLocation()
				setCameraProps({
					followUserLocation: true,
					followUserMode: UserTrackingMode.FollowWithHeading,
					followPitch: 45,
					followZoomLevel: 16,
				})
			} else {
				setCameraProps({
					followUserLocation: false,
				})
			}

			setCurrentlyFollowingUser(follow)
			return follow
		},
		[currentlyFollowingUser, centerLastKnownLocation],
	)

	return {
		toggleFollowUserLocation,
		currentlyFollowingUser,
		followingCameraProps: cameraProps,
	}
}
