import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'

import ComputedWalkTrace from '../ComputedWalkTrace'

@EventSubscriber()
export default class ComputedFogShapeSubscriber
	implements EntitySubscriberInterface<ComputedWalkTrace>
{
	listenTo() {
		return ComputedWalkTrace
	}

	afterInsert(): void {
		getAppWideEventsEmitter().emit(
			AppWideEvents.NewComputedWalkTrace,
			undefined,
		)
	}

	afterUpdate(): void {
		getAppWideEventsEmitter().emit(
			AppWideEvents.NewComputedWalkTrace,
			undefined,
		)
	}

	afterSoftRemove(): void {
		getAppWideEventsEmitter().emit(
			AppWideEvents.NewComputedWalkTrace,
			undefined,
		)
	}
}
