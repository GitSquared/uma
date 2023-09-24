import { expandOrCreateFog as _expandOrCreateFog } from '@lib/services/tracing-crawler/internal/fog-geometry'

export default function expandOrCreateFog(
	input: Parameters<typeof _expandOrCreateFog>,
): ReturnType<typeof _expandOrCreateFog> {
	return _expandOrCreateFog(...input)
}
