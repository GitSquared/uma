import { Stack } from 'expo-router'

export default function OnboardingLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				orientation: 'portrait',
			}}
		>
			<Stack.Screen
				name="1-intro"
				options={{
					animation: 'none',
				}}
			/>
			<Stack.Screen
				name="99-useless-rock"
				options={{
					animation: 'fade',
					animationDuration: 150,
				}}
			/>
		</Stack>
	)
}
