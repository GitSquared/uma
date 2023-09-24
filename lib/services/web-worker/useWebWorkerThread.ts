import { useContext } from 'react'

import WebWorkerThreadContext from './context'

export default function useWebWorkerThread() {
	const context = useContext(WebWorkerThreadContext)
	return context
}
