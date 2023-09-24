import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'

import LocationPoint from '../LocationPoint'

@EventSubscriber()
export default class LocationPointSubscriber
	implements EntitySubscriberInterface<LocationPoint>
{
	listenTo() {
		return LocationPoint
	}

	afterInsert(): void {
		getAppWideEventsEmitter().emit(AppWideEvents.NewRecordedData, undefined)
	}
}
