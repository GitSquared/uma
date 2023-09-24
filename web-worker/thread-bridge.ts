import type {
	ThreadedJobRequest,
	ThreadedJobResponse,
} from '@lib/services/web-worker/types'

import type {
	ThreadedFnInput,
	ThreadedFnName,
	ThreadedFnOutput,
} from './functions'

declare const window: {
	ReactNativeWebView: {
		postMessage: (message: string) => void
	}
}

// Worker thread-side bridge implementation

type ThreadedFunctionsMap = {
	[K in keyof ThreadedFnOutput]: (
		input: ThreadedFnInput[K],
	) => ThreadedFnOutput[K]
}

export class WorkerThreadBridge {
	constructor(functionsMap: ThreadedFunctionsMap) {
		this.functionsMap = functionsMap

		this.sendReadySignal()

		return this
	}

	private functionsMap: ThreadedFunctionsMap

	private sendReadySignal = (): void => {
		window.ReactNativeWebView.postMessage('ready')
	}

	private serializeResponseObject = <
		Res extends ThreadedJobResponse<ThreadedFnName>,
	>(
		msg: Res,
	): string => {
		return JSON.stringify(msg)
	}

	private submitJobResponse = <Fn extends ThreadedFnName>(
		response: ThreadedJobResponse<Fn>,
	): void => {
		const serializedResponse = this.serializeResponseObject(response)

		window.ReactNativeWebView.postMessage(serializedResponse)
	}

	private parseRequestMessage = <
		Req extends ThreadedJobRequest<ThreadedFnName>,
	>(
		msg: string,
	): Req => {
		const checkFormat = (parsedObject: unknown): parsedObject is Req => {
			if (
				// @ts-expect-error parsedObject is unknown
				!parsedObject.id ||
				// @ts-expect-error parsedObject is unknown
				!parsedObject.functionName ||
				// @ts-expect-error parsedObject is unknown
				!parsedObject.input
			) {
				return false
			}
			return true
		}
		const parsed: unknown = JSON.parse(msg)

		if (!checkFormat(parsed)) {
			throw new Error(
				'WorkerThreadBridge: invalid payload when parsing message',
			)
		}

		return parsed
	}

	public catchMessage = (msg: string): void => {
		const requestObject = this.parseRequestMessage(msg)

		this.processJob(requestObject)
	}

	private processJob = <Fn extends ThreadedFnName>(
		request: ThreadedJobRequest<Fn>,
	): void => {
		const { id, functionName, input } = request

		const output = this.functionsMap[functionName](input)

		const responseObject: ThreadedJobResponse<Fn> = {
			id,
			functionName,
			output,
		}

		this.submitJobResponse(responseObject)
	}
}
