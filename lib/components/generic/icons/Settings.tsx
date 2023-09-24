import { Line, Svg } from 'react-native-svg'

import { IconProps } from './types'

export default function SettingsIcon({ color, size }: IconProps) {
	return (
		<Svg width={size} height={size} viewBox="0 0 26 26">
			<Line
				stroke={color}
				strokeWidth={1.43}
				x1={12.7046}
				y1={2}
				x2={12.7046}
				y2={24}
			/>
			<Line
				stroke={color}
				strokeWidth={1.43}
				x1={22.2798}
				y1={7.58557}
				x2={3.12943}
				y2={18.4144}
			/>
			<Line
				stroke={color}
				strokeWidth={1.43}
				x1={3.12939}
				y1={7.58557}
				x2={22.2798}
				y2={18.4144}
			/>
		</Svg>
	)
}
