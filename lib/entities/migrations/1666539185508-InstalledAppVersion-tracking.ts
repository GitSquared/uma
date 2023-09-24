import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class InstalledAppVersionTracking1666539185508
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.createTable(
				new Table({
					name: 'installed_app_version',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
						},
						{
							name: 'timestamp',
							type: 'timestamp',
							default: 'now()',
						},
						{
							name: 'version',
							type: 'varchar',
						},
					],
				}),
			)
		} catch (e) {
			console.warn('migration not passed', e)
		}
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.dropTable('installed_app_version')
		} catch (e) {
			console.warn('migration rollback not passed', e)
		}
	}
}
