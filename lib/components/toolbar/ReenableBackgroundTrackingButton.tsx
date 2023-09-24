import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
	BounceInDown,
	BounceOutDown,
	FadeOutLeft,
} from 'react-native-reanimated'

import {
	backgroundColor,
	dimmerBackgroundColor,
	foregroundColor,
} from '../generic/styles'
import Switch from '../generic/Switch'
import Text from '../generic/Text'

export default function ReenableBackgroundTrackingButton() {
	const [batterySaver, setBatterySaver] = useSetting(
		UserSettingKey.BatterySaver,
	)
	const [switchValue, setSwitchValue] = useState(true)

	const turnItBackOn = useCallback(() => {
		setSwitchValue(false)
		void setBatterySaver(false).then(() => {
			setTimeout(() => {
				setSwitchValue(true)
			}, 600)
		})
	}, [setBatterySaver])

	if (!batterySaver) return null

	return (
		<Animated.View
			key="reenable-background-tracking-button"
			style={styles.container}
			entering={BounceInDown}
			exiting={BounceOutDown}
		>
			<Text size={16}>Don't drain my battery is</Text>
			<View>
				<Switch
					value={switchValue}
					onChange={turnItBackOn}
					trackColor={{
						true: dimmerBackgroundColor,
						false: backgroundColor,
					}}
					thumbColor={foregroundColor}
				/>
				{switchValue && (
					<Animated.View pointerEvents="none" exiting={FadeOutLeft}>
						<Text variant="numeric" size={13} style={styles.switchLabel}>
							on
						</Text>
					</Animated.View>
				)}
			</View>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: backgroundColor,
		borderRadius: 40,
		flexDirection: 'row',
		flex: 2,
		flexGrow: 1,
		justifyContent: 'space-between',
		padding: 6,
		paddingLeft: 20,
	},
	switchLabel: {
		color: backgroundColor,
		position: 'absolute',
		right: 7,
		top: -23,
		zIndex: 8,
	},
})
