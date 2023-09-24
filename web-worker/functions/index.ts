import expandOrCreateFog from './expand-create-fog'
import mergeComputedFogGeometries from './merge-fog-geometries'
import {
	MultithreadPerfTestInput,
	MultithreadPerfTestOutput,
} from './perf-test'
import renderFogMask from './render-fog-mask'

// Available threaded functions and their I/O

export enum ThreadedFnName {
	// Internal
	PerfTest = 'perf_test',

	RenderFogMask = 'render_fog_mask',
	ExpandOrCreateFog = 'expand_or_create_fog',
	MergeFogGeometries = 'merge_fog_geometries',
}

export interface ThreadedFnInput extends Record<ThreadedFnName, unknown> {
	[ThreadedFnName.PerfTest]: MultithreadPerfTestInput

	[ThreadedFnName.RenderFogMask]: Parameters<typeof renderFogMask>[0]
	[ThreadedFnName.ExpandOrCreateFog]: Parameters<typeof expandOrCreateFog>[0]
	[ThreadedFnName.MergeFogGeometries]: Parameters<
		typeof mergeComputedFogGeometries
	>[0]
}

export interface ThreadedFnOutput extends Record<ThreadedFnName, unknown> {
	[ThreadedFnName.PerfTest]: MultithreadPerfTestOutput

	[ThreadedFnName.RenderFogMask]: ReturnType<typeof renderFogMask>
	[ThreadedFnName.ExpandOrCreateFog]: ReturnType<typeof expandOrCreateFog>
	[ThreadedFnName.MergeFogGeometries]: ReturnType<
		typeof mergeComputedFogGeometries
	>
}
