import Spacer from '@lib/components/generic/Spacer'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'

export default function Onboarding4PermissionBackgroundScreen() {
	const router = useRouter()

	const askForPermission = useCallback(() => {
		void Location.requestBackgroundPermissionsAsync().then((result) => {
			if (result.granted) {
				router.push('/onboarding/5-all-set')
			} else if (!result.canAskAgain) {
				router.replace('/onboarding/99-useless-rock')
			}
		})
	}, [router])

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/wall-paint.png') as number}
			goNextLabel="Change to always"
			onGoNext={askForPermission}
		>
			<OnboardingInstructionText huge>Amazing!</OnboardingInstructionText>
			<Spacer size={26} />
			<OnboardingInstructionText>
				Now{'\n'}let's make sure{'\n'}the app follows you{'\n'}as you explore
				IRL
			</OnboardingInstructionText>
			<Spacer size={16} />
			<OnboardingInstructionText huge>
				Choose{'\n'}"Change to Always Allow"
			</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}
