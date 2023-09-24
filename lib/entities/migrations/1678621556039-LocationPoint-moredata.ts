import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class LocationPointMoreData1678621556039
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.changeColumn(
				'location_point',
				'altitude',
				new TableColumn({
					name: 'altitude',
					type: 'float',
					isNullable: true,
				}),
			)
			await queryRunner.addColumns('location_point', [
				new TableColumn({
					name: 'accuracy',
					type: 'float',
					isNullable: true,
				}),
				new TableColumn({
					name: 'speed',
					type: 'float',
					isNullable: true,
				}),
				new TableColumn({
					name: 'heading',
					type: 'float',
					isNullable: true,
				}),
			])
		} catch (e) {
			console.warn('migration not passed', e)
		}
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.changeColumn(
				'location_point',
				'altitude',
				new TableColumn({
					name: 'altitude',
					type: 'float',
					isNullable: false,
				}),
			)
			await queryRunner.dropColumns('location_point', [
				'accuracy',
				'speed',
				'heading',
			])
		} catch (e) {
			console.warn('migration rollback not passed', e)
		}
	}
}
