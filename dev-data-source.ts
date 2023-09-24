import { DataSource } from 'typeorm'

import entities from './lib/entities/index'
import migrations from './lib/entities/migrations/index'

export const DevDataSource = new DataSource({
	entities: entities,
	migrations: migrations,
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: '_migrations',

	type: 'sqlite',
	database: 'dev.sql',
	cache: false,
	logging: 'all',
})
