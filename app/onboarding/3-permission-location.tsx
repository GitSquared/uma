import Spacer from '@lib/components/generic/Spacer'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'

export default function Onboarding3PermissionLocationScreen() {
	const router = useRouter()

	const askForPermission = useCallback(() => {
		void Location.requestForegroundPermissionsAsync().then((result) => {
			if (result.granted) {
				router.push('/onboarding/4-permission-background')
			} else if (!result.canAskAgain) {
				router.replace('/onboarding/99-useless-rock')
			}
		})
	}, [router])

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/bridge.png') as number}
			goNextLabel="Allow location"
			onGoNext={askForPermission}
		>
			<Spacer size={32} />
			<OnboardingInstructionText>
				First{'\n'}let's turn on{'\n'}location access
			</OnboardingInstructionText>
			<Spacer size={42} />
			<OnboardingInstructionText huge>
				Choose{'\n'}"Allow while using app"
			</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}
