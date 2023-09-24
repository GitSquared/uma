export function makeMetersToPixelZoomInterpolation(targetSizeInMeters: number) {
	return [
		'interpolate',
		['exponential', 2],
		['zoom'],
		0,
		Math.max(targetSizeInMeters / 78271.484, 1),
		8,
		Math.max(targetSizeInMeters / 305.748, 1),
		16,
		Math.max(targetSizeInMeters / 1.194, 1),
		22,
		targetSizeInMeters / 0.019,
	]
}
