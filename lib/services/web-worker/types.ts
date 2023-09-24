import {
	ThreadedFnInput,
	ThreadedFnName,
	ThreadedFnOutput,
} from '@web-worker/functions'

export type UUID = string

// Transport layer types

abstract class ThreadedJobMessage<Fn extends ThreadedFnName> {
	id: UUID
	functionName: Fn
}

export interface ThreadedJobRequest<Fn extends ThreadedFnName>
	extends ThreadedJobMessage<Fn> {
	input: ThreadedFnInput[Fn]
}

export interface ThreadedJobResponse<Fn extends ThreadedFnName>
	extends ThreadedJobMessage<Fn> {
	output: ThreadedFnOutput[Fn]
}
