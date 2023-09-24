import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native'

import { actionColor, dimmerBackgroundColor } from './styles'

export type SwitchProps = RNSwitchProps

export default function Switch(props: SwitchProps) {
	return (
		<RNSwitch
			trackColor={{ false: dimmerBackgroundColor, true: actionColor }}
			{...props}
		/>
	)
}
