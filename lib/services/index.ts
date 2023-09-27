import * as TaskManager from 'expo-task-manager'

import { setupAppWideEvents } from './app-wide-events'
import {
	backgroundLocationService,
	backgroundLocationTaskName,
} from './background-location'

export function registerServices() {
	TaskManager.defineTask(backgroundLocationTaskName, backgroundLocationService)
	setupAppWideEvents()
}
