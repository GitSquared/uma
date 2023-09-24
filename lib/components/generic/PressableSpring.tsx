import * as Haptics from 'expo-haptics'
import * as React from 'react'
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	ViewStyle,
} from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	WithSpringConfig,
} from 'react-native-reanimated'

export const springConfig: WithSpringConfig = {
	stiffness: 150,
	damping: 12,
	mass: 0.25,
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface PressableSpringProps {
	onPress: (event: GestureResponderEvent) => void
	onPressIn?: (event: GestureResponderEvent) => void
	onPressOut?: (event: GestureResponderEvent) => void
	style?: StyleProp<ViewStyle>
	children?: React.ReactNode
}

export default function PressableSpring({
	onPress,
	style,
	children,
	...props
}: PressableSpringProps) {
	const scale = useSharedValue(1)

	const onPressIn: PressableSpringProps['onPressIn'] = (e) => {
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		scale.value = 0.9
		props.onPressIn?.(e)
	}

	const onPressOut: PressableSpringProps['onPressOut'] = (e) => {
		scale.value = 1
		props.onPressOut?.(e)
	}

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(scale.value, springConfig),
			},
		],
	}))

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			style={[style, animatedStyle]}
		>
			{children}
		</AnimatedPressable>
	)
}
