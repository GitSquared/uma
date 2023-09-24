import { A } from '@expo/html-elements'
import DebugInfo from '@lib/components/DebugInfo'
import Button from '@lib/components/generic/Button'
import SafeBottomSheetView from '@lib/components/generic/SafeBottomSheetView'
import Spacer from '@lib/components/generic/Spacer'
import {
	color4,
	dimmerBackgroundColor,
	dimmerForegroundColor,
	foregroundColor,
} from '@lib/components/generic/styles'
import Switch from '@lib/components/generic/Switch'
import Text from '@lib/components/generic/Text'
import ComputedFogShape from '@lib/entities/ComputedFogShape'
import ComputedWalkTrace from '@lib/entities/ComputedWalkTrace'
import LocationPoint from '@lib/entities/LocationPoint'
import {
	AppWideEvents,
	getAppWideEventsEmitter,
} from '@lib/services/app-wide-events'
import {
	exportLocationPoints,
	importLocationPoints,
} from '@lib/utils/import-export'
import { UserSettingKey } from '@lib/utils/settings'
import useSetting from '@lib/utils/useSetting'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

async function resetComputedData() {
	await ComputedFogShape.createQueryBuilder().delete().execute()
	await ComputedWalkTrace.createQueryBuilder().delete().execute()
	console.info('deleted all computed fog shapes')
	getAppWideEventsEmitter().emit(AppWideEvents.NewComputedFogShape, undefined)
	getAppWideEventsEmitter().emit(AppWideEvents.NewComputedWalkTrace, undefined)
}

async function resetGpsData() {
	await LocationPoint.createQueryBuilder().delete().execute()
	console.info('deleted all gps data')
	getAppWideEventsEmitter().emit(AppWideEvents.NewRecordedData, undefined)
}

export default function Settings() {
	const [batterySaver, setBatterySaver] = useSetting(
		UserSettingKey.BatterySaver,
	)
	const [showFog, setShowFog] = useSetting(UserSettingKey.Fog)
	const [showDebugView, setShowDebugView] = useSetting(UserSettingKey.DebugView)
	const [debugWriteMode, setDebugWriteMode] = useSetting(
		UserSettingKey.DebugWriteMode,
	)

	return (
		<SafeBottomSheetView>
			<ScrollView contentContainerStyle={styles.settingsContainer}>
				<View style={styles.settingsSectionHeader}>
					<Text size={18} variant="numeric">
						don&apos;t drain my battery
					</Text>
					<View style={styles.settingsSectionParams}>
						<Switch value={batterySaver} onValueChange={setBatterySaver} />
					</View>
				</View>
				<Text size={14} style={styles.settingsSectionDescriptionText}>
					turn this on to temporarily disable location tracking — if you’re
					running low on battery.
				</Text>
				<View style={styles.settingsSectionSeparator} />
				<View style={styles.settingsSectionHeader}>
					<Text size={18} variant="numeric">
						foggy fog
					</Text>
					<View style={styles.settingsSectionParams}>
						<Switch value={showFog} onValueChange={setShowFog} />
					</View>
				</View>
				<Text size={14} style={styles.settingsSectionDescriptionText}>
					see the entire map loud and clear — if you don't feel like exploring &
					want to have a look around
				</Text>
				<View style={styles.settingsSectionSeparator} />
				<View style={styles.settingsSectionHeader}>
					<Text size={18} variant="numeric">
						engineer lens
					</Text>
					<View style={styles.settingsSectionParams}>
						<Switch value={showDebugView} onValueChange={setShowDebugView} />
					</View>
				</View>
				<Text size={14} style={styles.settingsSectionDescriptionText}>
					see what&apos;s behind the curtain
				</Text>
				{showDebugView && (
					<>
						<Spacer size={8} />
						<View style={styles.settingsSectionHeader}>
							<Text
								size={14}
								style={{
									...styles.settingsSectionDescriptionText,
									color: foregroundColor,
								}}
							>
								tap to fake gps point
							</Text>
							<View style={styles.settingsSectionParams}>
								<Switch
									value={debugWriteMode}
									onValueChange={setDebugWriteMode}
								/>
							</View>
						</View>
					</>
				)}
				<View style={styles.settingsSectionSeparator} />
				<View style={styles.settingsSectionHeaderWithButtons}>
					<Button
						label="load from backup"
						onPress={() => {
							void importLocationPoints()
						}}
						style={styles.buttonInColumn}
					/>
					<Button
						label="back up"
						onPress={() => {
							void exportLocationPoints()
						}}
						style={[
							styles.buttonInColumn,
							{
								backgroundColor: color4,
							},
						]}
					/>
				</View>
				{showDebugView && (
					<>
						<Spacer size={8} />
						<View style={styles.settingsSectionHeaderWithButtons}>
							<Button
								onPress={() => {
									Alert.alert(
										'Are you sure?',
										'This will PERMANENTLY DELETE your location history. You might want to store a backup first.',
										[
											{
												text: 'Cancel',
												style: 'cancel',
											},
											{
												text: 'Reset',
												style: 'destructive',
												isPreferred: true,
												onPress: () => {
													resetComputedData()
														.then(() => resetGpsData())
														.then(() => {
															Alert.alert('Database reset completed')
														})
														.catch((err) => {
															Alert.alert('Error', JSON.stringify(err))
														})
												},
											},
										],
									)
								}}
								label="Reset gps data"
								style={[
									styles.buttonInColumn,
									styles.resetButton,
									styles.resetButtonWorse,
								]}
							/>
							<Button
								onPress={() => {
									Alert.alert(
										'Are you sure?',
										'This will delete all the data that was computed from your location history, like cleared fog and traced walks.\n\nYour phone will start recomputing those, starting from your latest recorded location.',
										[
											{
												text: 'Cancel',
												style: 'cancel',
											},
											{
												text: 'Reset',
												style: 'destructive',
												isPreferred: true,
												onPress: () => {
													resetComputedData()
														.then(() => {
															Alert.alert('Database reset completed')
														})
														.catch((err) => {
															Alert.alert('Error', JSON.stringify(err))
														})
												},
											},
										],
									)
								}}
								label="Reset computed data"
								style={[styles.buttonInColumn, styles.resetButton]}
							/>
						</View>
					</>
				)}
				<Spacer size={6} />
				<Text
					size={14}
					style={{
						...styles.settingsSectionDescriptionText,
						...styles.centeredDescriptionText,
					}}
				>
					you own your data. it's all stored locally on your device, and you can
					export it and do whatever you like with it anytime
				</Text>
				<Spacer size={24} />
				<View style={styles.footer}>
					<DebugInfo />
					<Spacer size={14} />
					<Text size={12} variant="numeric">
						Typeface Proto Mono by{' '}
						<A
							href="https://www.instagram.com/atk__studio/"
							style={styles.link}
						>
							ATK Studio
						</A>
					</Text>
					<Spacer size={6} />
					<Text size={12}>
						©️ 2022-{new Date().getFullYear().toString().slice(2)} the reality
						studies company UG
					</Text>
				</View>
			</ScrollView>
		</SafeBottomSheetView>
	)
}

const RED = '#bb0000'
const REDDER = '#ff0000'

const styles = StyleSheet.create({
	buttonInColumn: {
		flex: 1,
	},
	centeredDescriptionText: {
		maxWidth: 900,
		textAlign: 'center',
	},
	footer: {
		alignItems: 'center',
	},
	link: { textDecorationLine: 'underline' },
	resetButton: {
		backgroundColor: RED,
	},
	resetButtonWorse: {
		backgroundColor: REDDER,
	},
	settingsContainer: {
		alignItems: 'stretch',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginTop: 14,
		padding: 8,
		paddingBottom: 24,
		paddingTop: 0,
	},
	settingsSectionDescriptionText: {
		color: dimmerForegroundColor,
		marginTop: 6,
		maxWidth: 250,
	},
	settingsSectionHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	settingsSectionHeaderWithButtons: {
		alignItems: 'stretch',
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'space-between',
	},
	settingsSectionParams: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	settingsSectionSeparator: {
		backgroundColor: dimmerBackgroundColor,
		height: 1,
		marginVertical: 16,
		width: '100%',
	},
})
