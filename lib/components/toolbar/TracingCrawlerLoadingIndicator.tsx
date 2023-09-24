import useTracingCrawlerService from '@lib/services/tracing-crawler/useTracingCrawlerService'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import Spacer from '../generic/Spacer'
import Text from '../generic/Text'

export default function TracingCrawlerLoadingIndicator() {
	const tracingCrawlerService = useTracingCrawlerService()

	const [dotsCount, setDotsCount] = useState(0)

	useEffect(() => {
		if (!tracingCrawlerService || !tracingCrawlerService.isCrawlerRunning) {
			return
		}

		const interval = setInterval(() => {
			setDotsCount((prev) => (prev + 1) % 4)
		}, 500)

		return () => {
			clearInterval(interval)
		}
	}, [tracingCrawlerService])

	if (!tracingCrawlerService || !tracingCrawlerService.isCrawlerRunning) {
		return null
	}

	const cursorTimeDays: number | undefined =
		tracingCrawlerService.lastCrawlCursorTime
			? // time difference in days
			  Math.floor(
					(Date.now() - tracingCrawlerService.lastCrawlCursorTime.getTime()) /
						(1000 * 60 * 60 * 24),
			  )
			: undefined

	return (
		<View style={styles.container}>
			<Animated.View
				key="tracing-crawler-loading-indicator"
				entering={FadeIn}
				exiting={FadeOut}
			>
				<Text size={14} variant="numeric">
					Tracing your path{new Array(dotsCount).fill('.').join('')}
					{new Array(3 - dotsCount).fill(' ').join('')}
				</Text>
			</Animated.View>
			{cursorTimeDays && cursorTimeDays > 0 ? (
				<Animated.View
					key="tracing-crawler-cursor-time-indicator"
					style={styles.timeIndicatorContainer}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Text size={12} variant="numeric">
						from {cursorTimeDays} days ago
					</Text>
				</Animated.View>
			) : (
				<Spacer size={14} />
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-end',
		flex: 2,
		flexGrow: 1,
		height: 42,
		justifyContent: 'center',
	},
	timeIndicatorContainer: {
		marginRight: 24,
	},
})
