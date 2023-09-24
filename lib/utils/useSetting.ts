import { useCallback, useContext } from 'react'

import { UserSettingKey, UserSettings } from './settings'
import { SettingsContext } from './SettingsProvider'

export default function useSetting<k extends UserSettingKey>(
	key: k,
): [UserSettings[k] | undefined, (value: UserSettings[k]) => Promise<void>] {
	const { settings, set } = useContext(SettingsContext)

	const setCallback = useCallback(
		(value: UserSettings[k]) => {
			return set(key, value)
		},
		[key, set],
	)

	return [settings[key], setCallback]
}
