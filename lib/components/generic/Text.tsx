import { Text as RNText, TextStyle, View } from 'react-native'
import { StyleSheet } from 'react-native'

import { foregroundColor, highlightColor } from './styles'

interface TextPropsBase {
	size?: number
	variant?: 'numeric' | 'sans-serif' | 'wild'
	weight?: 'normal' | 'medium' | 'bold'
	style?: TextStyle
	children: React.ReactNode
}

interface TextPropsSansSerif extends TextPropsBase {
	variant?: 'sans-serif'
}

interface TextPropsNumeric extends TextPropsBase {
	variant: 'numeric'
	weight?: 'normal'
}

interface TextPropsWild extends TextPropsBase {
	variant?: 'wild'
	weight?: 'bold'
}

type TextProps = TextPropsSansSerif | TextPropsNumeric | TextPropsWild

// using forward ref here transforms Text into a class component animatable by reanimated
export default function Text({
	size = 14,
	variant = 'sans-serif',
	weight,
	style,
	children,
}: TextProps) {
	return (
		<View
			style={{
				...(variant === 'wild' ? defaultStyles.wildTextContainer : {}),
			}}
		>
			<RNText
				style={{
					...(variant === 'sans-serif' ? defaultStyles.sansText : {}),
					...(variant === 'numeric' ? defaultStyles.numericText : {}),
					...(variant === 'wild' ? defaultStyles.wildText : {}),

					...(weight === 'bold' ? defaultStyles.boldText : {}),
					fontSize: size,
					lineHeight: size * 1.2,
					...style,
				}}
			>
				{children}
				{/* Fix Caveat font overbleeding the last glyph */}
				{variant === 'wild' ? ' ' : ''}
			</RNText>

			{variant === 'wild' && (
				<>
					<RNText
						style={{
							...defaultStyles.wildText,
							fontSize: size,
							lineHeight: size * 1.2,
							...style,
							...defaultStyles.wildTextShadow,
							...defaultStyles.wildTextShadowOutlineNorth,
						}}
					>
						{children}{' '}
					</RNText>
					<RNText
						style={{
							...defaultStyles.wildText,
							fontSize: size,
							lineHeight: size * 1.2,
							...style,
							...defaultStyles.wildTextShadow,
							...defaultStyles.wildTextShadowOutlineSouth,
						}}
					>
						{children}{' '}
					</RNText>
					<RNText
						style={{
							...defaultStyles.wildText,
							fontSize: size,
							lineHeight: size * 1.2,
							...style,
							...defaultStyles.wildTextShadow,
							...defaultStyles.wildTextShadowOutlineWest,
						}}
					>
						{children}{' '}
					</RNText>
					<RNText
						style={{
							...defaultStyles.wildText,
							fontSize: size,
							lineHeight: size * 1.2,
							...style,
							...defaultStyles.wildTextShadow,
							...defaultStyles.wildTextShadowOutlineEast,
						}}
					>
						{children}{' '}
					</RNText>
					<RNText
						style={{
							...defaultStyles.wildText,
							fontSize: size,
							lineHeight: size * 1.2,
							...style,
							...defaultStyles.wildTextShadow,
							...defaultStyles.wildTextDropShadow,
						}}
					>
						{children}{' '}
					</RNText>
				</>
			)}
		</View>
	)
}

const defaultStyles = StyleSheet.create({
	boldText: {
		fontFamily: 'Inter-Tight-Bold',
		letterSpacing: 0.6,
	},
	numericText: {
		color: foregroundColor,
		fontFamily: 'Proto Mono',
		letterSpacing: -1,
		textTransform: 'uppercase',
	},
	sansText: {
		color: foregroundColor,
		fontFamily: 'Lexend',
	},
	wildText: {
		color: highlightColor,
		fontFamily: 'Caveat',
		textShadowColor: foregroundColor,
		zIndex: 2,
	},
	wildTextContainer: {
		transform: [{ translateX: -5 }],
	},
	wildTextDropShadow: {
		transform: [{ translateX: 2.42 }, { translateY: 2.42 }],
	},
	wildTextShadow: {
		color: foregroundColor,
		left: 0,
		position: 'absolute',
		top: 0,
		zIndex: 1,
	},
	wildTextShadowOutlineEast: {
		transform: [{ translateX: 1.21 }],
	},
	wildTextShadowOutlineNorth: {
		transform: [{ translateY: -1.21 }],
	},
	wildTextShadowOutlineSouth: {
		transform: [{ translateY: 1.21 }],
	},
	wildTextShadowOutlineWest: {
		transform: [{ translateX: -1.21 }],
	},
})
