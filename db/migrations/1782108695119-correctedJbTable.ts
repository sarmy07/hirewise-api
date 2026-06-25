import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectedJbTable1782108695119 implements MigrationInterface {
    name = 'CorrectedJbTable1782108695119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" RENAME COLUMN "cereatedAt" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" RENAME COLUMN "createdAt" TO "cereatedAt"`);
    }

}
