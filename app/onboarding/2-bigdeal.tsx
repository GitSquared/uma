import Spacer from '@lib/components/generic/Spacer'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import { useRouter } from 'expo-router'

export default function Onboarding2BigDealScreen() {
	const router = useRouter()

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/flowers.png') as number}
			onGoNext={() => {
				router.push('/onboarding/3-permission-location')
			}}
		>
			<OnboardingInstructionText>
				For the app to work,
			</OnboardingInstructionText>
			<OnboardingInstructionText huge>
				it will follow you around
			</OnboardingInstructionText>
			<OnboardingInstructionText>
				tracking your location{'\n'}in the background
			</OnboardingInstructionText>
			<Spacer size={4} />
			<OnboardingInstructionText>
				We know it's a big deal.
			</OnboardingInstructionText>
			<OnboardingInstructionText>
				We will never{'\n'}
				sell your data{' '}
			</OnboardingInstructionText>
			<OnboardingInstructionText>
				Since you own it,{'\n'}you can export or{'\n'}delete it at any time
			</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}
