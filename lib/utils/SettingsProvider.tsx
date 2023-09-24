import {
	loadSettings,
	UserSettingKey,
	UserSettings,
	writeSetting,
} from '@lib/utils/settings'
import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'

interface SettingsContextType {
	settings: Partial<UserSettings> // setting can be undefined if not loaded yet
	set: <k extends UserSettingKey>(
		key: k,
		value: UserSettings[k],
	) => Promise<void>
}

export const SettingsContext = createContext<SettingsContextType>({
	settings: {},
	set: async () => {},
})

// Synchronize settings changes with the state tree
export default function SettingsProvider({
	children,
}: {
	children: ReactNode
}) {
	const [settings, setSettings] = useState<Partial<UserSettings>>({})

	useEffect(() => {
		void loadSettings().then((settings) => {
			setSettings(settings)
		})
	}, [])

	const set = useCallback<SettingsContextType['set']>(async (key, value) => {
		try {
			await writeSetting(key, value)
			const newSettings = await loadSettings()
			setSettings(newSettings)
		} catch (err) {
			console.error('failed to write setting', key, err)
		}
	}, [])

	return (
		<SettingsContext.Provider
			value={{
				settings,
				set,
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}
