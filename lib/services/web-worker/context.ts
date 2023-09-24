import { createContext } from 'react'

import ThreadBridgeEventBus from './thread-bridge'

const WebWorkerThreadContext = createContext<ThreadBridgeEventBus | null>(null)

export default WebWorkerThreadContext
