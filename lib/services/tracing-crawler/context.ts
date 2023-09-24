import { createContext } from 'react'

import { TracingCrawlerService } from './types'

const TracingCrawlerServiceContext =
	createContext<TracingCrawlerService | null>(null)

export default TracingCrawlerServiceContext
