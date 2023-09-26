import Spacer from '@lib/components/generic/Spacer'
import { dimmerForegroundColor } from '@lib/components/generic/styles'
import Text from '@lib/components/generic/Text'
import LocationPoint from '@lib/entities/LocationPoint'
import dataSource from '@lib/utils/data-source'
import Constants from 'expo-constants'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

export default function DebugInfo() {
	const [locationPointsCount, setLocationPointsCount] = useState(0)

	useEffect(() => {
		const refresher = setInterval(() => {
			void LocationPoint.count().then((count) => {
				setLocationPointsCount(count)
			})
		}, 1000)

		return () => {
			clearInterval(refresher)
		}
	}, [])

	return (
		<>
			<Text size={12} variant="numeric" style={styles.debugInfoText}>
				SOME INFORMATION FOR NERDS
			</Text>
			<Spacer size={6} />
			<Text size={10} style={styles.debugInfoText}>
				{`${Constants.expoConfig?.ios?.bundleIdentifier}`}
				{' | '}
				{`sdk v${Constants.expoConfig?.sdkVersion ?? 'unknown'}`}
				{' / '}
				{`runtime v${
					(Constants.expoConfig?.runtimeVersion as string | undefined) ??
					'unknown'
				}`}
				{'\n'}
				{`build ${Constants.expoConfig?.version ?? 'unknown'}`}
				{'\n'}
				database: {dataSource.options.database}
				{' / '}
				traced points: {locationPointsCount}
			</Text>
		</>
	)
}

const styles = StyleSheet.create({
	debugInfoText: {
		color: dimmerForegroundColor,
		textAlign: 'center',
	},
})
