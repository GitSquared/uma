import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Toolbar({ children }: { children: ReactNode }) {
	return (
		<View style={styles.uiToolbar} pointerEvents="box-none">
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	uiToolbar: {
		alignItems: 'flex-end',
		flexDirection: 'row',
		gap: 12,
		justifyContent: 'flex-start',
	},
})
