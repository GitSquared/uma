import 'reflect-metadata' // Needed for typeorm
import 'react-native-get-random-values'
import 'react-native-console-time-polyfill'
import { LogBox } from "react-native"

import { registerServices } from './lib/services'

import 'expo-router/entry'

LogBox.ignoreAllLogs(true)

registerServices()
