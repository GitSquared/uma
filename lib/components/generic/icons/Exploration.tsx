import { Circle, Svg } from 'react-native-svg'

import { IconProps } from './types'

export default function ExplorationIcon({ color, size }: IconProps) {
	return (
		<Svg width={size} height={size} viewBox="0 0 26 26">
			<Circle
				fill="transparent"
				stroke={color}
				strokeWidth={1.3}
				cx={13}
				cy={13}
				r={2.35}
			/>
			<Circle
				fill="transparent"
				stroke={color}
				strokeWidth={1.3}
				cx={13}
				cy={13}
				r={12.35}
			/>
		</Svg>
	)
}
