import EventEmitter from '@lib/utils/event-emitter'
import type {
	ThreadedFnInput,
	ThreadedFnName,
	ThreadedFnOutput,
} from '@web-worker/functions'
import type { RefObject } from 'react'
import type WebView from 'react-native-webview'
import type { WebViewMessageEvent } from 'react-native-webview'
import { v4 as uuid } from 'uuid'

import type { ThreadedJobRequest, ThreadedJobResponse, UUID } from './types'

// Main thread-side bridge and event bus implementation
// Sends job requests to the worker thread, parses responses,
// and emits events on the app side

type WebViewThreadRef = RefObject<WebView>['current']

function passMessageToThread(
	threadRef: Exclude<WebViewThreadRef, null>,
	msg: string,
): void {
	threadRef.injectJavaScript(
		`window._threadBridge_.catchMessage('${msg}');true;`,
	)
}

type ThreadBridgeEventName = ThreadedFnName | 'ready'

type ThreadBridgeEventPayload = {
	[K in keyof ThreadedFnOutput]: ThreadedFnOutput[K]
} & { ready: undefined }

export default class ThreadBridgeEventBus extends EventEmitter<
	ThreadBridgeEventName,
	ThreadBridgeEventPayload
> {
	constructor(threadRef: WebViewThreadRef) {
		super()
		this.threadRef = threadRef
		return this
	}

	public ready: boolean = false

	private threadRef: WebViewThreadRef = null

	private serializeRequestObject = <
		Req extends ThreadedJobRequest<ThreadedFnName>,
	>(
		msg: Req,
	): string => {
		return JSON.stringify(msg)
	}

	public submitJobRequest = <Fn extends ThreadedFnName>(
		functionName: Fn,
		input: ThreadedFnInput[Fn],
	): `${Fn}::${UUID}` => {
		if (!this.ready || !this.threadRef) {
			throw new Error('ThreadBridge: not ready to submit job request')
		}

		const requestObject: ThreadedJobRequest<Fn> = {
			id: uuid(),
			functionName,
			input,
		}

		const serializedRequest = this.serializeRequestObject(requestObject)

		passMessageToThread(this.threadRef, serializedRequest)

		return `${functionName}::${requestObject.id}`
	}

	private parseResponseMessage = <
		Res extends ThreadedJobResponse<ThreadedFnName>,
	>(
		msg: string,
	): Res => {
		const checkFormat = (parsedObject: unknown): parsedObject is Res => {
			if (
				// @ts-expect-error parsedObject is unknown
				!parsedObject.id ||
				// @ts-expect-error parsedObject is unknown
				!parsedObject.functionName ||
				// @ts-expect-error parsedObject is unknown
				!parsedObject.output
			) {
				return false
			}
			return true
		}
		const parsed: unknown = JSON.parse(msg)

		if (!checkFormat(parsed)) {
			throw new Error('ThreadBridge: invalid payload when parsing message')
		}

		return parsed
	}

	public onThreadMessage = (event: WebViewMessageEvent): void => {
		const { data } = event.nativeEvent

		if (data.startsWith('ready')) {
			console.info('ThreadBridge: thread ready')
			this.ready = true
			this._triggerEvent('ready', undefined)
			return
		}

		const responseMsg = this.parseResponseMessage(data)

		const { id, functionName, output } = responseMsg

		super._triggerEvent(`${functionName}::${id}`, output)
	}
}
