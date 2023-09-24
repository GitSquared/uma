import Button from '@lib/components/generic/Button'
import ArrowRightIcon from '@lib/components/generic/icons/ArrowRight'
import { actionColor, backgroundColor } from '@lib/components/generic/styles'
import { Image } from 'expo-image'
import { Accelerometer, Gyroscope } from 'expo-sensors'
import { PropsWithChildren, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const BACKGROUND_PHOTO_BLEED = 20
const gyroEasingFactorX = 1.7
const gyroEasingFactorY = 3
const gyroEasingFactorZ = 0.8

interface FloatingCameraScreenProps {
	photo: Image['props']['source']
	onGoNext: () => void
	disableFloat?: boolean
	goNextLabel?: string
}

export default function FloatingCameraScreen({
	photo,
	onGoNext,
	disableFloat,
	goNextLabel,
	children,
}: PropsWithChildren<FloatingCameraScreenProps>) {
	const [gyro, setGyroscopeData] = useState({
		x: 0,
		y: 0,
		z: 0,
	})
	const [gyroSub, setGyroSub] = useState<ReturnType<
		(typeof Gyroscope)['addListener']
	> | null>(null)

	const [accel, setAccelerometerData] = useState({
		x: 0,
		y: 0,
		z: 0,
	})
	const [accelSub, setAccelSub] = useState<ReturnType<
		(typeof Accelerometer)['addListener']
	> | null>(null)

	useEffect(() => {
		setGyroSub(Gyroscope.addListener(setGyroscopeData))
		setAccelSub(Accelerometer.addListener(setAccelerometerData))
		return () => {
			gyroSub && gyroSub.remove()
			setGyroSub(null)
			accelSub && accelSub.remove()
			setAccelSub(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const rotateX = useSharedValue('0deg')
	const rotateY = useSharedValue('0deg')
	const rotateZ = useSharedValue('0deg')

	if (disableFloat) {
		rotateX.value = '0deg'
		rotateY.value = '0deg'
		rotateZ.value = '0deg'
	} else {
		rotateX.value = `${(gyro.x + accel.x) * gyroEasingFactorX}deg`
		rotateY.value = `${(gyro.y + accel.y) * gyroEasingFactorY}deg`
		rotateZ.value = `${(gyro.z + accel.z) * gyroEasingFactorZ}deg`
	}

	const gyroTiltStyle = useAnimatedStyle(() => ({
		transform: [
			{ perspective: 3000 },
			{
				rotateX: withSpring(rotateX.value),
			},
			{
				rotateY: withSpring(rotateY.value),
			},
			{
				rotateZ: withSpring(rotateZ.value),
			},
		],
	}))

	const insets = useSafeAreaInsets()

	return (
		<>
			<Animated.View style={[styles.fillContainer, gyroTiltStyle]}>
				<Image
					style={styles.overBleedImageBackground}
					source={photo}
					cachePolicy="memory-disk"
					contentFit="cover"
					contentPosition="center"
				/>
				<View
					style={[
						styles.instructionsContainer,
						{
							top: insets.top,
						},
					]}
				>
					{children}
				</View>
			</Animated.View>
			<View
				style={[
					styles.buttonContainer,
					{
						bottom: insets.bottom,
					},
				]}
			>
				<Button
					onPress={onGoNext}
					label={goNextLabel}
					style={{
						...styles.goNextButton,
						...(goNextLabel
							? styles.goNextButtonLabeled
							: styles.goNextButtonRound),
					}}
				>
					{!goNextLabel ? (
						<ArrowRightIcon size={32} color={backgroundColor} />
					) : undefined}
				</Button>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: 'center',
		height: 50,
		marginBottom: '13%',
		position: 'absolute',
		width: '100%',
		zIndex: 200,
	},
	fillContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
	},
	goNextButton: {
		backgroundColor: actionColor,
		borderRadius: 64,
		height: 64,
	},
	goNextButtonLabeled: {
		paddingHorizontal: 16,
	},
	goNextButtonRound: {
		width: 64,
	},
	instructionsContainer: {
		alignItems: 'center',
		flexDirection: 'column',
		gap: 16,
		height: '60%',
		marginBottom: '20%',
		width: '85%',
	},
	overBleedImageBackground: {
		...StyleSheet.absoluteFillObject,
		bottom: -BACKGROUND_PHOTO_BLEED,
		left: -BACKGROUND_PHOTO_BLEED,
		right: -BACKGROUND_PHOTO_BLEED,
		top: -BACKGROUND_PHOTO_BLEED,
	},
})
