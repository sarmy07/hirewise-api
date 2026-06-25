import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBioLocationPortoflioUrlToUserTbl1781495991694 implements MigrationInterface {
    name = 'AddedBioLocationPortoflioUrlToUserTbl1781495991694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "portofolioUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "portofolioUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    }

}
