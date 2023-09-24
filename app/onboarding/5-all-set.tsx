import Spacer from '@lib/components/generic/Spacer'
import FloatingCameraScreen from '@lib/components/onboarding/FloatingCameraScreen'
import OnboardingInstructionText from '@lib/components/onboarding/OnboardingInstructionText'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { useRouter } from 'expo-router'

export default function Onboarding5AllSetScreen() {
	const router = useRouter()

	const [, setRunOnboardingAtNextLaunch] = useSetting(
		UserSettingKey.RunOnboardingAtNextLaunch,
	)
	const [, setBatterySaver] = useSetting(UserSettingKey.BatterySaver)

	return (
		<FloatingCameraScreen
			photo={require('@assets/onboarding/graffiti.png') as number}
			goNextLabel="Explore the world"
			onGoNext={() => {
				const newSettingsPromises = [
					setRunOnboardingAtNextLaunch(false),
					setBatterySaver(false),
				]
				void Promise.all(newSettingsPromises).then(() => {
					router.push('/')
				})
			}}
		>
			<Spacer size={150} />
			<OnboardingInstructionText>Fantastic!</OnboardingInstructionText>
			<OnboardingInstructionText huge>You're all set</OnboardingInstructionText>
		</FloatingCameraScreen>
	)
}
