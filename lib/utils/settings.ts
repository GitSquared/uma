import UserSetting from '@lib/entities/UserSetting'

export enum UserSettingKey {
	RunOnboardingAtNextLaunch = 'runOnboardingAtNextLaunch',
	BatterySaver = 'batterySaver',
	Fog = 'fog',
	DebugView = 'debugView',
	DebugWriteMode = 'debugWriteMode',
}

export interface UserSettings {
	[UserSettingKey.RunOnboardingAtNextLaunch]: boolean
	[UserSettingKey.BatterySaver]: boolean
	[UserSettingKey.Fog]: boolean
	[UserSettingKey.DebugView]: boolean
	[UserSettingKey.DebugWriteMode]: boolean
}

export const DEFAULT_SETTINGS: UserSettings = {
	[UserSettingKey.RunOnboardingAtNextLaunch]: true,
	[UserSettingKey.BatterySaver]: true, // toggled off after permissions setup
	[UserSettingKey.Fog]: true,
	[UserSettingKey.DebugView]: false,
	[UserSettingKey.DebugWriteMode]: false,
}

export async function loadSettings(): Promise<UserSettings> {
	console.info('Loading user settings')
	const settings = {}

	const settingsKeys = Object.values(UserSettingKey)

	let i = 0

	while (i < settingsKeys.length) {
		const key: UserSettingKey = settingsKeys[i]

		const userSetting = await UserSetting.findOneBy({
			key,
		})

		const rawValue: number | undefined = userSetting?.value
		if (!userSetting || typeof rawValue === 'undefined') {
			await writeSetting(key, DEFAULT_SETTINGS[key])
			// loop again without incrementing cursor
			continue
		}

		let parsedValue: UserSettings[typeof key] | undefined

		switch (key) {
			// Boolean settings
			case UserSettingKey.RunOnboardingAtNextLaunch:
			case UserSettingKey.BatterySaver:
			case UserSettingKey.Fog:
			case UserSettingKey.DebugView:
			case UserSettingKey.DebugWriteMode:
				if (rawValue === 0) {
					parsedValue = false
				} else if (rawValue === 1) {
					parsedValue = true
				}
				break
		}

		if (typeof parsedValue === 'undefined') {
			console.warn(
				'Unknown setting value',
				{ key, rawValue },
				'resetting to default',
			)
			// initialize back to known deserializable value
			await writeSetting(key, DEFAULT_SETTINGS[key])
			// loop again without incrementing cursor
			continue
		}

		settings[key] = parsedValue
		i++
	}

	return settings as UserSettings
}

export async function writeSetting(
	key: UserSettingKey,
	value: UserSettings[typeof key],
): Promise<void> {
	let serializedValue: number
	switch (key) {
		// Boolean settings
		case UserSettingKey.RunOnboardingAtNextLaunch:
		case UserSettingKey.BatterySaver:
		case UserSettingKey.Fog:
		case UserSettingKey.DebugView:
		case UserSettingKey.DebugWriteMode:
			if (!value) {
				serializedValue = 0
			} else {
				serializedValue = 1
			}
			break
	}

	console.info('Setting', key, 'to', value)

	const userSetting = await UserSetting.findOneBy({
		key,
	})

	if (userSetting) {
		userSetting.value = serializedValue
		await userSetting.save()
	} else {
		await UserSetting.create({
			key,
			value: serializedValue,
		}).save()
	}
}
