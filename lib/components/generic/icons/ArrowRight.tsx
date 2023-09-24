import { Path, Svg } from 'react-native-svg'

import { IconProps } from './types'

export default function ArrowRightIcon({ color, size }: IconProps) {
	return (
		<Svg width={size} height={size} viewBox="0 0 32 32">
			<Path
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M5 16H27"
			/>
			<Path
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M18 7L27 16L18 25"
			/>
		</Svg>
	)
}
