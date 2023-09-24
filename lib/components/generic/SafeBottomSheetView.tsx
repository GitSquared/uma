import Tabbar, { TOOLBAR_HEIGHT } from '@lib/components/tabbar/Tabbar'
import TabButton, { TabButtonVariant } from '@lib/components/tabbar/TabButton'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { Stack, useRouter } from 'expo-router'
import { ReactNode, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
	Easing,
	EasingFn,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ExplorationIcon from './icons/Exploration'
import SettingsIcon from './icons/Settings'
import { appBackgroundColor, backgroundColor } from './styles'

export const safeBottomSheetViewScreenOptions: Parameters<
	typeof Stack.Screen
>[0]['options'] = {
	presentation: 'containedTransparentModal',
	animation: 'none',
	gestureEnabled: true,
	gestureDirection: 'vertical',
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

function withSlowIn(value: number, easing?: EasingFn) {
	return withTiming(value, {
		easing: easing ?? Easing.linear,
		duration: 500,
	})
}

function withFastOut(value: number, easing?: EasingFn) {
	return withTiming(value, {
		easing: easing ?? Easing.linear,
		duration: 200,
	})
}

export default function SafeBottomSheetView({
	children,
}: {
	children: ReactNode
}) {
	const router = useRouter()
	const insets = useSafeAreaInsets()

	const fade = useSharedValue(0)

	const fadeStyle = useAnimatedStyle(() => ({
		backgroundColor: `hsla(0, 0%, 60%, ${fade.value * 0.4})`,
	}))

	const slide = useSharedValue(-70)

	const slideStyle = useAnimatedStyle(() => ({
		bottom: `${slide.value}%`,
	}))

	const closeModal = useCallback(() => {
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

		fade.value = withFastOut(0)
		slide.value = withFastOut(-70, Easing.in(Easing.exp))

		setTimeout(() => {
			router.push('/home')
		}, 200)
	}, [fade, slide, router])

	return (
		<>
			<View
				style={[
					defaultStyle.tabbarOverlay,
					{
						bottom: insets.bottom,
					},
				]}
			>
				{/*
				 * This is a hack because we're using a fullscreen modal view instead of a true tab navigator.
				 * The tabbar is visible behind the modal view, but interactions cannot pass through, so we're re-rendering it on top.
				 */}
				<Tabbar>
					<TabButton
						label="Exploration"
						variant={TabButtonVariant.Yellow}
						icon={ExplorationIcon}
						onPress={closeModal}
					/>
					<TabButton
						label="Settings"
						variant={TabButtonVariant.Green}
						icon={SettingsIcon}
						onPress={() => null}
						active
					/>
				</Tabbar>
			</View>
			<View
				style={[
					defaultStyle.safeContainer,
					{
						bottom: insets.bottom + TOOLBAR_HEIGHT,
					},
				]}
				onLayout={() => {
					fade.value = withSlowIn(1)
					slide.value = withSlowIn(0, Easing.out(Easing.exp))
				}}
			>
				<AnimatedBlurView
					intensity={8}
					style={[defaultStyle.backdrop, fadeStyle]}
					onTouchEnd={closeModal}
				/>
				<Animated.View style={[defaultStyle.safeBottomSheetView, slideStyle]}>
					{children}
				</Animated.View>
			</View>
		</>
	)
}

const defaultStyle = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	safeBottomSheetView: {
		backgroundColor: backgroundColor,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		bottom: 0,
		maxHeight: '85%',
		padding: 16,
	},
	safeContainer: {
		borderCurve: 'continuous',
		borderRadius: 32,
		...StyleSheet.absoluteFillObject,
		alignItems: 'stretch',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		overflow: 'hidden',
		zIndex: 10,
	},
	tabbarOverlay: {
		backgroundColor: appBackgroundColor,
		height: TOOLBAR_HEIGHT,
		left: 0,
		position: 'absolute',
		right: 0,
		zIndex: 15,
	},
})
