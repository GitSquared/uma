import Spacer from '@lib/components/generic/Spacer'
import { backgroundColor } from '@lib/components/generic/styles'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import { useRouter } from 'expo-router'
import { Linking, StyleSheet } from 'react-native'

export default function Onboarding99UselessRockScreen() {
	const router = useRouter()

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/rock.png') as number}
			onGoNext={() => {
				void Linking.openSettings()
				router.replace('/onboarding/3-permission-location')
			}}
			goNextLabel="Open settings"
			disableFloat
		>
			<OnboardingInstructionText style={styles.invertedText}>
				Woops, the app can't{'\n'}access your location :(
			</OnboardingInstructionText>
			<OnboardingInstructionText style={styles.invertedText}>
				unfortunately, it won't{'\n'}work without it:
			</OnboardingInstructionText>
			<OnboardingInstructionText style={styles.invertedText}>
				it has now turned into a
			</OnboardingInstructionText>
			<OnboardingInstructionText style={styles.invertedText} huge>
				useless rock
			</OnboardingInstructionText>
			<OnboardingInstructionText style={styles.invertedText}>
				how sad.
			</OnboardingInstructionText>
			<Spacer size={16} />
			<OnboardingInstructionText style={styles.invertedText}>
				You can go to your{'\n'}device settings and set{'\n'}location to always
				on
				{'\n'}to continue
			</OnboardingInstructionText>
			<Spacer size={26} />
			<OnboardingInstructionText style={styles.invertedText}>
				(or just keep the rock)
			</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}

const styles = StyleSheet.create({
	invertedText: {
		color: backgroundColor,
	},
})
