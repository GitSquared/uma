import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import crawlTrace from '@lib/services/tracing-crawler'
import useWebWorkerThread from '@lib/services/web-worker/useWebWorkerThread'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { ReactNode, useEffect, useState } from 'react'

import TracingCrawlerServiceContext from './context'

export default function TracingCrawlerServiceProvider({
	children,
}: {
	children: ReactNode
}) {
	const [batterySaver] = useSetting(UserSettingKey.BatterySaver)
	const workerThread = useWebWorkerThread()

	const [loopRunning, setLoopRunning] = useState(false)
	const [restartLoopTrigger, setRestartLoopTrigger] = useState(0)

	const [lastCrawlCursorTime, setLastCrawlCursorTime] = useState<
		Date | undefined
	>(undefined)

	useEffect(() => {
		if (loopRunning) return

		const listenerId = getAppWideEventsEmitter().on(
			AppWideEvents.NewRecordedData,
			() => {
				console.info('path tracer: new data recorded, restarting loop')
				setRestartLoopTrigger((t) => (t === 0 ? 1 : 0))
			},
		)

		return () => {
			getAppWideEventsEmitter().unsubscribe(
				AppWideEvents.NewRecordedData,
				listenerId,
			)
		}
	}, [loopRunning])

	useEffect(() => {
		if (!workerThread || batterySaver) return
		console.info('path tracer: starting loop')

		let handle: ReturnType<typeof setImmediate> | undefined

		setLastCrawlCursorTime(undefined)

		let i = 0
		const loop = async () => {
			i++
			if (i === 10) {
				i = 0
			}

			const crawlerRunResults = await crawlTrace(workerThread)

			if (!crawlerRunResults.moreWorkAhead) {
				console.info('path tracer: no more points to trace, stopping loop')
				setLoopRunning(false)
				return
			}

			setLastCrawlCursorTime(crawlerRunResults.cursorTime)

			handle = setImmediate(() => void loop())
		}

		setLoopRunning(true)
		void loop()

		return () => {
			setLoopRunning(false)
			clearImmediate(handle)
		}
	}, [workerThread, restartLoopTrigger, batterySaver])

	return (
		<TracingCrawlerServiceContext.Provider
			value={{
				isCrawlerRunning: loopRunning,
				lastCrawlCursorTime,
			}}
		>
			{children}
		</TracingCrawlerServiceContext.Provider>
	)
}
