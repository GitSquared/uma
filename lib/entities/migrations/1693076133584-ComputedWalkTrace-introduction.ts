import { MigrationInterface, QueryRunner } from 'typeorm'

export class ComputedWalkTraceIntroduction1693076133584
	implements MigrationInterface
{
	name = 'ComputedWalkTraceIntroduction1693076133584'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "computed_walk_trace" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar
            )
        `)
		await queryRunner.query(`
            CREATE TABLE "temporary_computed_walk_trace" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar,
                CONSTRAINT "FK_7ee57da414de4fee26349436a87" FOREIGN KEY ("latestPointId") REFERENCES "location_point" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_d39331f0147a66c7243a3f9d53e" FOREIGN KEY ("earliestPointId") REFERENCES "location_point" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
		await queryRunner.query(`
            INSERT INTO "temporary_computed_walk_trace"(
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
            FROM "computed_walk_trace"
        `)
		await queryRunner.query(`
            DROP TABLE "computed_walk_trace"
        `)
		await queryRunner.query(`
            ALTER TABLE "temporary_computed_walk_trace"
                RENAME TO "computed_walk_trace"
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE "computed_walk_trace"
                RENAME TO "temporary_computed_walk_trace"
        `)
		await queryRunner.query(`
            CREATE TABLE "computed_walk_trace" (
                "id" varchar PRIMARY KEY NOT NULL,
                "lastUpdatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "geojson" text NOT NULL,
                "latestPointId" varchar,
                "earliestPointId" varchar
            )
        `)
		await queryRunner.query(`
            INSERT INTO "computed_walk_trace"(
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
            FROM "temporary_computed_walk_trace"
        `)
		await queryRunner.query(`
            DROP TABLE "temporary_computed_walk_trace"
        `)
		await queryRunner.query(`
            DROP TABLE "computed_walk_trace"
        `)
	}
}
