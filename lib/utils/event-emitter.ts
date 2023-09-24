import { v4 as uuid } from 'uuid'
type UUID = string

type Listener<T> = (data: T) => void

type GenericPossibleEventsData<GenericPossibleEvents extends string> = Record<
	GenericPossibleEvents,
	unknown
>

type WithOptionalSuffix<EventName extends string> =
	| EventName
	| `${EventName}::${string}`

// Type-safe event emitter class with support for recurring and one-time subcribers, unsub, and strongly typed event names and data
// Support generic event names with a :: suffix,
// like event::uuid . Very useful for listening to specific instances of events
export default abstract class EventEmitter<
	PossibleEvents extends string,
	PossibleEventsData extends GenericPossibleEventsData<PossibleEvents>,
> {
	private listeners: Map<
		WithOptionalSuffix<PossibleEvents>,
		Map<UUID, Listener<PossibleEventsData[PossibleEvents]>>
	> = new Map()

	private onceListeners: Map<
		WithOptionalSuffix<PossibleEvents>,
		Map<UUID, Listener<PossibleEventsData[PossibleEvents]>>
	> = new Map()

	public on<EventName extends PossibleEvents>(
		event: WithOptionalSuffix<EventName>,
		func: Listener<PossibleEventsData[EventName]>,
	): UUID {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Map())
		}
		const listenerId = uuid()
		this.listeners.get(event)?.set(listenerId, func)
		return listenerId
	}

	public once<EventName extends PossibleEvents>(
		event: WithOptionalSuffix<EventName>,
		func: Listener<PossibleEventsData[EventName]>,
	): UUID {
		if (!this.onceListeners.has(event)) {
			this.onceListeners.set(event, new Map())
		}
		const listenerId = uuid()
		this.onceListeners.get(event)?.set(listenerId, func)
		return listenerId
	}

	public unsubscribe<EventName extends PossibleEvents>(
		event: WithOptionalSuffix<EventName>,
		listenerId: UUID,
	): void {
		this.listeners.get(event)?.delete(listenerId)
		this.onceListeners.get(event)?.delete(listenerId)
	}

	public waitFor<EventName extends PossibleEvents>(
		event: WithOptionalSuffix<EventName>,
	): Promise<PossibleEventsData[EventName]> {
		return new Promise((resolve) => {
			this.once(event, (e) => {
				resolve(e)
			})
		})
	}

	protected _triggerEvent<EventName extends PossibleEvents>(
		event: WithOptionalSuffix<EventName>,
		data: PossibleEventsData[EventName],
	): void {
		this.listeners.get(event)?.forEach((listener) => {
			listener(data)
		})

		if (this.onceListeners.has(event)) {
			this.onceListeners.get(event)?.forEach((listener) => {
				listener(data)
			})
			this.onceListeners.delete(event)
		}
	}
}
