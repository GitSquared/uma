import { ThreadedFnName } from './functions'
import expandOrCreateFog from './functions/expand-create-fog'
import mergeComputedFogGeometries from './functions/merge-fog-geometries'
import multithreadPerfTest from './functions/perf-test'
import renderFogMask from './functions/render-fog-mask'
import { WorkerThreadBridge } from './thread-bridge'

declare const window: {
	_threadBridge_: WorkerThreadBridge
}

window._threadBridge_ = new WorkerThreadBridge({
	[ThreadedFnName.PerfTest]: multithreadPerfTest,

	[ThreadedFnName.RenderFogMask]: renderFogMask,
	[ThreadedFnName.ExpandOrCreateFog]: expandOrCreateFog,
	[ThreadedFnName.MergeFogGeometries]: mergeComputedFogGeometries,
})
