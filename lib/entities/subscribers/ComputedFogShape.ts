import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'

import ComputedFogShape from '../ComputedFogShape'

@EventSubscriber()
export default class ComputedFogShapeSubscriber
	implements EntitySubscriberInterface<ComputedFogShape>
{
	listenTo() {
		return ComputedFogShape
	}

	afterInsert(): void {
		getAppWideEventsEmitter().emit(AppWideEvents.NewComputedFogShape, undefined)
	}

	afterUpdate(): void {
		getAppWideEventsEmitter().emit(AppWideEvents.NewComputedFogShape, undefined)
	}

	afterSoftRemove(): void {
		getAppWideEventsEmitter().emit(AppWideEvents.NewComputedFogShape, undefined)
	}
}
