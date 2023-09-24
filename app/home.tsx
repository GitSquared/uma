import CurrentMapLocation from '@lib/components/CurrentMapLocation'
import ExplorationIcon from '@lib/components/generic/icons/Exploration'
import SettingsIcon from '@lib/components/generic/icons/Settings'
import {
	appBackgroundColor,
	backgroundColor,
} from '@lib/components/generic/styles'
import LocationIndicator from '@lib/components/map/items/LocationIndicator'
import PointsLayer from '@lib/components/map/layers/debug/PointsLayer'
import FogLayer from '@lib/components/map/layers/FogLayer'
import TracesLayer from '@lib/components/map/layers/TracesLayer'
import Map, { MapRef } from '@lib/components/map/Map'
import Tabbar from '@lib/components/tabbar/Tabbar'
import TabButton, { TabButtonVariant } from '@lib/components/tabbar/TabButton'
import CenterCurrentLocationButton from '@lib/components/toolbar/CenterCurrentLocationButton'
import ReenableBackgroundTrackingButton from '@lib/components/toolbar/ReenableBackgroundTrackingButton'
import Toolbar from '@lib/components/toolbar/Toolbar'
import TracingCrawlerLoadingIndicator from '@lib/components/toolbar/TracingCrawlerLoadingIndicator'
import { usePathname, useRouter } from 'expo-router'
import { createRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
	const mapRef = createRef<MapRef>()

	const insets = useSafeAreaInsets()

	const router = useRouter()
	const pathname = usePathname()

	const overlaysTopMargin = insets.top
	const overlaysBottomMargin = 16

	return (
		<View style={[styles.appContainer, { paddingBottom: insets.bottom }]}>
			<View style={styles.mapContainer}>
				<Map ref={mapRef}>
					<FogLayer />
					<TracesLayer />
					<PointsLayer />
					<LocationIndicator />
				</Map>

				<View
					style={[
						styles.mapOverlayContainer,
						styles.mapFullWidthOverlayContainer,
						{ top: overlaysTopMargin },
					]}
					pointerEvents="box-none"
				>
					<CurrentMapLocation mapRef={mapRef} />
				</View>

				<View
					style={[
						styles.mapOverlayContainer,
						styles.mapFullWidthOverlayContainer,
						{ bottom: overlaysBottomMargin },
					]}
					pointerEvents="box-none"
				>
					<Toolbar>
						<CenterCurrentLocationButton mapRef={mapRef} />
						<TracingCrawlerLoadingIndicator />
						<ReenableBackgroundTrackingButton />
					</Toolbar>
				</View>
			</View>

			<Tabbar>
				<TabButton
					label="Exploration"
					variant={TabButtonVariant.Yellow}
					icon={ExplorationIcon}
					onPress={() => {
						router.push('/home')
					}}
					active={pathname === '/home'}
				/>
				<TabButton
					label="Settings"
					variant={TabButtonVariant.Green}
					icon={SettingsIcon}
					onPress={() => {
						router.push('/settings')
					}}
					active={pathname === '/settings'}
				/>
			</Tabbar>
		</View>
	)
}

const styles = StyleSheet.create({
	appContainer: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: appBackgroundColor,
		flexDirection: 'column',
	},
	mapContainer: {
		backgroundColor,
		borderBottomLeftRadius: 32,
		borderBottomRightRadius: 32,
		borderCurve: 'continuous',
		flex: 1,
		overflow: 'hidden',
	},
	mapFullWidthOverlayContainer: {
		left: 16,
		right: 16,
	},
	mapOverlayContainer: {
		bottom: 'auto',
		left: 'auto',
		paddingTop: 16,
		position: 'absolute',
		right: 'auto',
	},
})
