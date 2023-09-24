import * as TaskManager from 'expo-task-manager'

import { setupAppWideEvents } from './app-wide-events'
import {
	backgroundLocationService,
	backgroundLocationTaskName,
} from './background-location'
import { setupMonitoring } from './monitoring'

export function registerServices() {
	setupMonitoring()

	TaskManager.defineTask(backgroundLocationTaskName, backgroundLocationService)
	setupAppWideEvents()
}
