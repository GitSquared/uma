import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class LocationPointAltitude1666540961339
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.addColumn(
				'location_point',
				new TableColumn({
					name: 'altitude',
					type: 'float',
				}),
			)
		} catch (e) {
			console.warn('migration not passed', e)
		}
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.dropColumn('location_point', 'altitude')
		} catch (e) {
			console.warn('migration rollback not passed', e)
		}
	}
}
