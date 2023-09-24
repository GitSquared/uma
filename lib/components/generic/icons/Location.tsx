import Animated, {
	useAnimatedProps,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'
import { Line, LineProps, Svg } from 'react-native-svg'

import { springConfig } from '../PressableSpring'
import { IconProps } from './types'

const AnimatedLine = Animated.createAnimatedComponent(Line)

interface LocationIconProps extends IconProps {
	pressed?: boolean
}

export default function LocationIcon({
	color,
	size,
	pressed,
}: LocationIconProps) {
	const commonIconLineProps: LineProps = {
		stroke: color,
		strokeLinecap: 'round',
		strokeWidth: 2,
	}

	const lineLength = 7
	const padding = useSharedValue(7.5)

	if (pressed) {
		padding.value = withSpring(9, springConfig)
	} else {
		padding.value = withSpring(7.5, springConfig)
	}

	const westLineAnimatedProps = useAnimatedProps(() => ({
		x1: padding.value,
		x2: padding.value + lineLength,
	}))
	const eastLineAnimatedProps = useAnimatedProps(() => ({
		x1: 42 - padding.value,
		x2: 42 - padding.value - lineLength,
	}))
	const northLineAnimatedProps = useAnimatedProps(() => ({
		y1: padding.value,
		y2: padding.value + lineLength,
	}))
	const southLineAnimatedProps = useAnimatedProps(() => ({
		y1: 42 - padding.value,
		y2: 42 - padding.value - lineLength,
	}))

	return (
		<Svg width={size} height={size} viewBox="0 0 42 42">
			<AnimatedLine
				// West
				y1={21}
				y2={21}
				{...commonIconLineProps}
				animatedProps={westLineAnimatedProps}
			/>
			<AnimatedLine
				// East
				y1={21}
				y2={21}
				{...commonIconLineProps}
				animatedProps={eastLineAnimatedProps}
			/>
			<AnimatedLine
				// North
				x1={21}
				x2={21}
				{...commonIconLineProps}
				animatedProps={northLineAnimatedProps}
			/>
			<AnimatedLine
				// South
				x1={21}
				x2={21}
				{...commonIconLineProps}
				animatedProps={southLineAnimatedProps}
			/>
		</Svg>
	)
}
