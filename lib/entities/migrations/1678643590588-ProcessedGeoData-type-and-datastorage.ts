import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProcessedGeoDataTypeAndDatastorage1678643590588
	implements MigrationInterface
{
	name = 'ProcessedGeoDataTypeAndDatastorage1678643590588'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_70fb5cb273cb954bfe80556902"`)
		await queryRunner.query(`DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_processed_geo_data_raw_data_source_location_point" ("processedGeoDataId" varchar NOT NULL, "locationPointId" varchar NOT NULL, CONSTRAINT "FK_829bb6083f217f0c95ac8d4102a" FOREIGN KEY ("processedGeoDataId") REFERENCES "processed_geo_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("processedGeoDataId", "locationPointId"))`,
		)
		await queryRunner.query(
			`INSERT INTO "temporary_processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId") SELECT "processedGeoDataId", "locationPointId" FROM "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`DROP TABLE "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`ALTER TABLE "temporary_processed_geo_data_raw_data_source_location_point" RENAME TO "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_processed_geo_data" ("id" varchar PRIMARY KEY NOT NULL, "processedAt" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "geojsonFeature" text NOT NULL)`,
		)
		await queryRunner.query(
			`INSERT INTO "temporary_processed_geo_data"("id", "processedAt") SELECT "id", "processedAt" FROM "processed_geo_data"`,
		)
		await queryRunner.query(`DROP TABLE "processed_geo_data"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_processed_geo_data" RENAME TO "processed_geo_data"`,
		)
		await queryRunner.query(`DROP INDEX "IDX_70fb5cb273cb954bfe80556902"`)
		await queryRunner.query(`DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_processed_geo_data_raw_data_source_location_point" ("processedGeoDataId" varchar NOT NULL, "locationPointId" varchar NOT NULL, CONSTRAINT "FK_829bb6083f217f0c95ac8d4102a" FOREIGN KEY ("processedGeoDataId") REFERENCES "processed_geo_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_70fb5cb273cb954bfe805569025" FOREIGN KEY ("locationPointId") REFERENCES "location_point" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("processedGeoDataId", "locationPointId"))`,
		)
		await queryRunner.query(
			`INSERT INTO "temporary_processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId") SELECT "processedGeoDataId", "locationPointId" FROM "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`DROP TABLE "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`ALTER TABLE "temporary_processed_geo_data_raw_data_source_location_point" RENAME TO "processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId") `,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"`)
		await queryRunner.query(`DROP INDEX "IDX_70fb5cb273cb954bfe80556902"`)
		await queryRunner.query(
			`ALTER TABLE "processed_geo_data_raw_data_source_location_point" RENAME TO "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE TABLE "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId" varchar NOT NULL, "locationPointId" varchar NOT NULL, CONSTRAINT "FK_829bb6083f217f0c95ac8d4102a" FOREIGN KEY ("processedGeoDataId") REFERENCES "processed_geo_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("processedGeoDataId", "locationPointId"))`,
		)
		await queryRunner.query(
			`INSERT INTO "processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId") SELECT "processedGeoDataId", "locationPointId" FROM "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`DROP TABLE "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId") `,
		)
		await queryRunner.query(
			`ALTER TABLE "processed_geo_data" RENAME TO "temporary_processed_geo_data"`,
		)
		await queryRunner.query(
			`CREATE TABLE "processed_geo_data" ("id" varchar PRIMARY KEY NOT NULL, "processedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
		)
		await queryRunner.query(
			`INSERT INTO "processed_geo_data"("id", "processedAt") SELECT "id", "processedAt" FROM "temporary_processed_geo_data"`,
		)
		await queryRunner.query(`DROP TABLE "temporary_processed_geo_data"`)
		await queryRunner.query(`DROP INDEX "IDX_829bb6083f217f0c95ac8d4102"`)
		await queryRunner.query(`DROP INDEX "IDX_70fb5cb273cb954bfe80556902"`)
		await queryRunner.query(
			`ALTER TABLE "processed_geo_data_raw_data_source_location_point" RENAME TO "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE TABLE "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId" varchar NOT NULL, "locationPointId" varchar NOT NULL, CONSTRAINT "FK_70fb5cb273cb954bfe805569025" FOREIGN KEY ("locationPointId") REFERENCES "location_point" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_829bb6083f217f0c95ac8d4102a" FOREIGN KEY ("processedGeoDataId") REFERENCES "processed_geo_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("processedGeoDataId", "locationPointId"))`,
		)
		await queryRunner.query(
			`INSERT INTO "processed_geo_data_raw_data_source_location_point"("processedGeoDataId", "locationPointId") SELECT "processedGeoDataId", "locationPointId" FROM "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`DROP TABLE "temporary_processed_geo_data_raw_data_source_location_point"`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_829bb6083f217f0c95ac8d4102" ON "processed_geo_data_raw_data_source_location_point" ("processedGeoDataId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_70fb5cb273cb954bfe80556902" ON "processed_geo_data_raw_data_source_location_point" ("locationPointId") `,
		)
	}
}
