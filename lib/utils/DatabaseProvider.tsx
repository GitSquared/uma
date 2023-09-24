import InstalledAppVersion from '@lib/entities/InstalledAppVersion'
import Constants from 'expo-constants'
import type { PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import type { DataSource } from 'typeorm'

import dataSource from './data-source'

export type DatabaseContextValue = DataSource | undefined

export const databaseContext = createContext<DatabaseContextValue>(undefined)

export async function initializeDatabase(): Promise<void> {
	if (dataSource.isInitialized) {
		await dataSource.destroy()
	}
	await dataSource.initialize()

	console.info('Starting database sync')

	const refreshLatestAppVersion = async () => {
		const [{ version }] = await InstalledAppVersion.find({
			select: ['version'],
			order: { timestamp: 'DESC' },
		})
		lastAppVersion = version
	}

	let lastAppVersion: string | undefined

	try {
		await refreshLatestAppVersion()

		const pendingMigrations = await dataSource.showMigrations()

		console.log('Database status at boot:')
		console.log({ lastAppVersion, pendingMigrations })

		if (!lastAppVersion) throw new Error('Invalid last version')
	} catch {
		console.info(
			'last installed app version not found, synchronizing database schema',
		)

		await dataSource.synchronize(true)
		// we just synced the schema from scratch, so old migrations don't apply.
		// mark them as executed so we only look at post-sync migrations for real execution.
		console.info('Fast-forwarding previous migrations...')
		await dataSource.runMigrations({ transaction: 'all', fake: true })
	}

	console.info('Running migrations...')
	await dataSource.runMigrations()

	const pendingMigrations = await dataSource.showMigrations()

	const currentVersion = Constants.expoConfig?.version ?? 'unknown'
	if (lastAppVersion !== currentVersion) {
		console.info('Updating app version...')
		const newAppVersion = new InstalledAppVersion()
		newAppVersion.version = currentVersion
		console.log({ lastAppVersion, newAppVersion: currentVersion })
		await newAppVersion.save()
	}

	console.info('Database sync finished')

	await refreshLatestAppVersion()

	console.log('New database status:')
	console.log({ lastAppVersion, pendingMigrations })
}

export default function DatabaseProvider({ children }: PropsWithChildren) {
	const [databaseContextValue, setDatabaseContextValue] =
		useState<DatabaseContextValue>(undefined)

	useEffect(() => {
		async function ensureDatabaseOpened() {
			if (!dataSource.isInitialized) {
				await initializeDatabase()
			}
			setDatabaseContextValue(dataSource)
		}

		void ensureDatabaseOpened()
	}, [])

	return (
		<databaseContext.Provider value={databaseContextValue}>
			{children}
		</databaseContext.Provider>
	)
}
