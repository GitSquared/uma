import EventEmitter from '@lib/utils/event-emitter'

export enum AppWideEvents {
	NewRecordedData = 'new_recorded_data',
	NewComputedFogShape = 'new_computed_fog_shape',
	NewComputedWalkTrace = 'new_computed_walk_trace',
}

interface AppWideEventsData {
	[AppWideEvents.NewRecordedData]: undefined
	[AppWideEvents.NewComputedFogShape]: undefined
	[AppWideEvents.NewComputedWalkTrace]: undefined
}

export class AppWideEventsEmitter extends EventEmitter<
	AppWideEvents,
	AppWideEventsData
> {
	constructor() {
		super()
		return this
	}

	// public emitter
	public emit<EventName extends AppWideEvents>(
		event: EventName,
		data: AppWideEventsData[EventName],
	) {
		super._triggerEvent(event, data)
	}
}

export function setupAppWideEvents() {
	console.info('setting up app-wide events...')
	const appWideEvents = new AppWideEventsEmitter()
	global._getAppWideEventsEmitter = <T>() => appWideEvents as T
}

export function getAppWideEventsEmitter(): AppWideEventsEmitter {
	return (global._getAppWideEventsEmitter as <T>() => T)<AppWideEventsEmitter>()
}
