import Spacer from '@lib/components/generic/Spacer'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

export default function Onboarding1IntroScreen() {
	const router = useRouter()

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/wall.png') as number}
			onGoNext={() => {
				router.push('/onboarding/2-bigdeal')
			}}
		>
			<OnboardingInstructionText>
				Hello and welcome{'\n'}to untitled map app
			</OnboardingInstructionText>
			<Spacer size={4} />
			<OnboardingInstructionText huge>
				your{'\n'}
				personal map{'\n'}of the world
			</OnboardingInstructionText>
			<Spacer size={4} />
			<Image
				style={styles.fogPrintedDemo}
				source={require('@assets/onboarding/fog-printed.png') as number}
			/>
			<OnboardingInstructionText>
				as you move around,{'\n'}you'll see where you've been —{'\n'}and where
				you haven't
			</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}

const styles = StyleSheet.create({
	fogPrintedDemo: {
		height: 82,
		width: 120,
	},
})
