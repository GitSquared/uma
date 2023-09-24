import type { Camera } from '@rnmapbox/maps'

export interface ExtendedCameraRef extends Camera {
	runningAnimation?: boolean
}
