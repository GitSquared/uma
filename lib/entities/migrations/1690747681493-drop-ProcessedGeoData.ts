import { MigrationInterface, QueryRunner } from 'typeorm'

export class DropProcessedGeoData1690747681493 implements MigrationInterface {
	name = 'DropProcessedGeoData1690747681493'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP INDEX "IDX_70fb5cb273cb954bfe80556902"
        `)
		await queryRunner.query(`
            DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"
        `)
		await queryRunner.query(`
            ALTER TABLE "processed_geo_data_raw_data_source_location_point"
                RENAME TO "temporary_processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            CREATE TABLE "processed_geo_data_raw_data_source_location_point" (
                "processedGeoDataId" varchar NOT NULL,
                "locationPointId" varchar NOT NULL,
                PRIMARY KEY ("processedGeoDataId", "locationPointId")
            )
        `)
		await queryRunner.query(`
            INSERT INTO "processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId")
            SELECT "processedGeoDataId",
                "locationPointId"
            FROM "temporary_processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            DROP TABLE "temporary_processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId")
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId")
        `)
		await queryRunner.query(`
            DROP INDEX "IDX_70fb5cb273cb954bfe80556902"
        `)
		await queryRunner.query(`
            DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"
        `)
		await queryRunner.query(`
            DROP TABLE "processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            DROP TABLE "processed_geo_data"
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "processed_geo_data" (
                "id" varchar PRIMARY KEY NOT NULL,
                "processedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "type" varchar NOT NULL,
                "geojsonFeature" text NOT NULL
            )
        `)
		await queryRunner.query(`
            CREATE TABLE "processed_geo_data_raw_data_source_location_point" (
                "processedGeoDataId" varchar NOT NULL,
                "locationPointId" varchar NOT NULL,
                PRIMARY KEY ("processedGeoDataId", "locationPointId")
            )
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId")
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId")
        `)
		await queryRunner.query(`
            DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"
        `)
		await queryRunner.query(`
            DROP INDEX "IDX_70fb5cb273cb954bfe80556902"
        `)
		await queryRunner.query(`
            CREATE TABLE "temporary_processed_geo_data_raw_data_source_location_point" (
                "processedGeoDataId" varchar NOT NULL,
                "locationPointId" varchar NOT NULL,
                CONSTRAINT "FK_829bb6083f217f0c95ac8d4102a" FOREIGN KEY ("processedGeoDataId") REFERENCES "processed_geo_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_70fb5cb273cb954bfe805569025" FOREIGN KEY ("locationPointId") REFERENCES "location_point" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                PRIMARY KEY ("processedGeoDataId", "locationPointId")
            )
        `)
		await queryRunner.query(`
            INSERT INTO "temporary_processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId")
            SELECT "processedGeoDataId",
                "locationPointId"
            FROM "processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            DROP TABLE "processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            ALTER TABLE "temporary_processed_geo_data_raw_data_source_location_point"
                RENAME TO "processed_geo_data_raw_data_source_location_point"
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId")
        `)
		await queryRunner.query(`
            CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId")
        `)
	}
}
