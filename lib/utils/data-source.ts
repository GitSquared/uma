import entities from '@lib/entities/index'
import migrations from '@lib/entities/migrations/index'
import subscribers from '@lib/entities/subscribers/index'
import * as ExpoSqliteDriver from 'expo-sqlite'
import { DataSource } from 'typeorm'

export const DATABASE_ORM_OPTIONS = {
	entities: entities,
	migrations: migrations,
	subscribers: subscribers,
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: '_migrations',
}

export default new DataSource({
	...DATABASE_ORM_OPTIONS,

	type: 'expo',
	database: 'traces-local',
	driver: ExpoSqliteDriver,
	cache: true,
	logging: ['error', 'schema', 'warn'],
})
