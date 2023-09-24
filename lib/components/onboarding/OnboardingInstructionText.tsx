import { PropsWithChildren } from 'react'
import { StyleSheet, TextStyle } from 'react-native'

import Text from '../generic/Text'

interface OnboardingInstructionTextProps {
	huge?: boolean
	style?: TextStyle
}

export default function OnboardingInstructionText({
	huge = false,
	style,
	children,
}: PropsWithChildren<OnboardingInstructionTextProps>) {
	return (
		<Text
			variant="sans-serif"
			size={huge ? 34 : 16}
			weight="bold"
			style={{
				...styles.instructionText,
				...(huge ? styles.instructionTextHuge : {}),
				...style,
			}}
		>
			{children}
		</Text>
	)
}

const styles = StyleSheet.create({
	instructionText: {
		lineHeight: 24,
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	instructionTextHuge: {
		lineHeight: 45,
	},
})
