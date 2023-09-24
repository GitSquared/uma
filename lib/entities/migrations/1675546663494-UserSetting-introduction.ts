import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export default class UserSettingIntroduction1675546663494
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.createTable(
				new Table({
					name: 'user_setting',
					columns: [
						{
							name: 'key',
							type: 'varchar',
							isPrimary: true,
						},
						{
							name: 'value',
							type: 'int',
						},
					],
				}),
			)
			await queryRunner.createIndex(
				'user_setting',
				new TableIndex({
					columnNames: ['key'],
					isUnique: true,
				}),
			)
		} catch (e) {
			console.warn('migration not passed', e)
		}
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		try {
			await queryRunner.dropIndex(
				'user_setting',
				new TableIndex({
					columnNames: ['key'],
					isUnique: true,
				}),
			)
			await queryRunner.dropTable('user_setting')
		} catch (e) {
			console.warn('migration rollback not passed', e)
		}
	}
}
