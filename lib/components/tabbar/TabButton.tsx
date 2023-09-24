import { IconProps } from '@lib/components/generic/icons/types'
import {
	appForegroundColor,
	color5,
	dimmerBackgroundColor,
	highlightColor,
} from '@lib/components/generic/styles'
import Text from '@lib/components/generic/Text'
import * as Haptics from 'expo-haptics'
import { FC, useState } from 'react'
import { ColorValue, Pressable, StyleSheet, View } from 'react-native'

export enum TabButtonVariant {
	Yellow = 'yellow',
	Green = 'green',
}

interface TabButtonProps {
	label: string
	variant: TabButtonVariant
	icon: FC<IconProps>
	active?: boolean
	onPress: () => void
}

interface TabButtonColors {
	foreground: ColorValue
	background: ColorValue
}

const colors: Record<
	TabButtonVariant,
	Record<'on' | 'off', TabButtonColors>
> = {
	[TabButtonVariant.Yellow]: {
		on: {
			foreground: highlightColor,
			background: highlightColor,
		},
		off: {
			foreground: appForegroundColor,
			background: 'transparent',
		},
	},
	[TabButtonVariant.Green]: {
		on: {
			foreground: color5,
			background: dimmerBackgroundColor,
		},
		off: {
			foreground: appForegroundColor,
			background: 'transparent',
		},
	},
}

export default function TabButton({
	label,
	variant,
	icon: Icon,
	active,
	onPress,
}: TabButtonProps) {
	const [pressed, setPressed] = useState(false)

	const colorsForVariant = colors[variant]

	const on = active || pressed

	return (
		<Pressable
			disabled={active}
			onPress={onPress}
			onPressIn={() => {
				void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
				setPressed(true)
			}}
			onPressOut={() => {
				setPressed(false)
			}}
			hitSlop={10}
		>
			<View style={styles.buttonContainer}>
				<View
					style={[
						styles.buttonBackground,
						{ backgroundColor: colorsForVariant[on ? 'on' : 'off'].background },
					]}
				/>
				<Icon
					size={26}
					color={colorsForVariant[on ? 'on' : 'off'].foreground}
				/>
				<Text
					variant="sans-serif"
					size={14}
					style={{
						...styles.buttonLabel,
						color: colorsForVariant[on ? 'on' : 'off'].foreground,
					}}
				>
					{label}
				</Text>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	buttonBackground: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 40,
		opacity: 0.14,
	},
	buttonContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6,
		justifyContent: 'flex-start',
		paddingLeft: 6,
		paddingRight: 16,
		paddingVertical: 6,
	},
	buttonLabel: {
		textTransform: 'capitalize',
	},
})
