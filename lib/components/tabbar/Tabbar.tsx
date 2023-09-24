import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

export const TOOLBAR_HEIGHT = 50

export default function Toolbar({ children }: { children: ReactNode }) {
	return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-end',
		flexDirection: 'row',
		gap: 8,
		height: TOOLBAR_HEIGHT,
		justifyContent: 'center',
	},
})
