import { MigrationInterface, QueryRunner } from 'typeorm'

export class ComputedFogShapeIntroduction1690748167898
	implements MigrationInterface
{
	name = 'ComputedFogShapeIntroduction1690748167898'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "computed_fog_shape" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar
            )
        `)
		await queryRunner.query(`
            CREATE TABLE "temporary_computed_fog_shape" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar,
                CONSTRAINT "FK_141bf0099d5b319374150fabeea" FOREIGN KEY ("latestPointId") REFERENCES "location_point" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_828d499c2789d14ca68acc35a4e" FOREIGN KEY ("earliestPointId") REFERENCES "location_point" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
		await queryRunner.query(`
            INSERT INTO "temporary_computed_fog_shape"(
                    "id",
                    "lastUpdatedAt",
                    "geojson",
                    "latestPointId",
                    "earliestPointId"
                )
            SELECT "id",
                "lastUpdatedAt",
                "geojson",
                "latestPointId",
                "earliestPointId"
            FROM "computed_fog_shape"
        `)
		await queryRunner.query(`
            DROP TABLE "computed_fog_shape"
        `)
		await queryRunner.query(`
            ALTER TABLE "temporary_computed_fog_shape"
                RENAME TO "computed_fog_shape"
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE "computed_fog_shape"
                RENAME TO "temporary_computed_fog_shape"
        `)
		await queryRunner.query(`
            CREATE TABLE "computed_fog_shape" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar
            )
        `)
		await queryRunner.query(`
            INSERT INTO "computed_fog_shape"(
                    "id",
                    "lastUpdatedAt",
                    "geojson",
                    "latestPointId",
                    "earliestPointId"
                )
            SELECT "id",
                "lastUpdatedAt",
                "geojson",
                "latestPointId",
                "earliestPointId"
            FROM "temporary_computed_fog_shape"
        `)
		await queryRunner.query(`
            DROP TABLE "temporary_computed_fog_shape"
        `)
		await queryRunner.query(`
            DROP TABLE "computed_fog_shape"
        `)
	}
}
