import { PropsWithChildren, useEffect } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'

import PressableSpring from './PressableSpring'
import { backgroundColor, color3 } from './styles'
import Text from './Text'

export interface ButtonProps {
	onPress: () => void
	label?: string
	fontSize?: number
	progress?: number
	style?: StyleProp<ViewStyle>
}

export default function Button({
	label,
	onPress,
	fontSize = 16,
	progress,
	style,
	children,
}: PropsWithChildren<ButtonProps>) {
	const progressAnimation = useSharedValue(0)

	const animatedProgressIndicatorStyle = useAnimatedStyle(() => ({
		width: withSpring(`${100 - progressAnimation.value * 100}%`),
	}))

	useEffect(() => {
		progressAnimation.value = progress ?? 0
	}, [progressAnimation, progress])

	return (
		<PressableSpring onPress={onPress} style={[styles.button, style]}>
			{typeof progress === 'number' && (
				<Animated.View
					style={[
						StyleSheet.absoluteFill,
						styles.progressIndicator,
						progress > 0.001 && styles.progressIndicatorStarted,
						animatedProgressIndicatorStyle,
					]}
				/>
			)}
			<View style={styles.buttonLabelContainer}>
				{children ?? (
					<Text variant="numeric" size={fontSize} style={styles.buttonLabel}>
						{label}
					</Text>
				)}
			</View>
		</PressableSpring>
	)
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: color3,
		borderRadius: 8,
		justifyContent: 'center',
		paddingVertical: 12,
	},
	buttonLabel: {
		color: backgroundColor,
		textAlign: 'center',
	},
	buttonLabelContainer: {
		flexDirection: 'row',
		paddingHorizontal: 12,
		paddingVertical: 0,
	},
	progressIndicator: {
		backgroundColor,
		borderRadius: 8,
		left: 'auto',
		opacity: 0.5,
		right: 0,
	},
	progressIndicatorStarted: {
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,
	},
})
