import { useMemo } from 'react'
import { View } from 'react-native'

export interface SpacerProps {
	size: number
	horizontal?: boolean
}

export default function Spacer({ size, horizontal }: SpacerProps) {
	const styles = useMemo(
		() => ({
			spacer: {
				height: horizontal ? 1 : size,
				width: horizontal ? size : 1,
			},
		}),
		[size, horizontal],
	)

	return <View style={styles.spacer} />
}
