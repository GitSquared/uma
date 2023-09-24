import { actionColor } from '@lib/components/generic/styles'
import { checkHasGrantedRequiredPermissions } from '@lib/utils/permissions'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { useRootNavigation, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

export default function IndexScreen() {
	const router = useRouter()
	const navigation = useRootNavigation()

	const [runOnboardingAtNextLaunch] = useSetting(
		UserSettingKey.RunOnboardingAtNextLaunch,
	)

	useEffect(() => {
		if (navigation?.isReady() && !navigation.getCurrentRoute()?.path) {
			console.log('running root router')
			console.log('should run onboarding', runOnboardingAtNextLaunch)

			void checkHasGrantedRequiredPermissions().then((granted) => {
				if (!granted || runOnboardingAtNextLaunch) {
					console.log('Going to onboarding')
					setImmediate(() => {
						router.replace('/onboarding/1-intro')
					})
				} else {
					console.log('Going to home')
					setImmediate(() => {
						router.replace('/home')
					})
				}
			})
		}
	}, [navigation, router, runOnboardingAtNextLaunch])

	return (
		<ActivityIndicator
			animating
			color={actionColor}
			size="small"
			style={StyleSheet.absoluteFill}
		/>
	)
}
