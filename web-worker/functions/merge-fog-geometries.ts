import { mergeComputedFogGeometries as _mergeComputedFogGeometries } from '@lib/services/tracing-crawler/internal/fog-geometry'

export default function mergeComputedFogGeometries(
	input: Parameters<typeof _mergeComputedFogGeometries>,
): ReturnType<typeof _mergeComputedFogGeometries> {
	return _mergeComputedFogGeometries(...input)
}
