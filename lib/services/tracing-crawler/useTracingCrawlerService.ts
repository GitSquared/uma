import { useContext } from 'react'

import TracingCrawlerServiceContext from './context'

export default function useTracingCrawlerService() {
	const context = useContext(TracingCrawlerServiceContext)
	return context
}
