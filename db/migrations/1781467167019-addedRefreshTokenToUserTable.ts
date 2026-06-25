import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRefreshTokenToUserTable1781467167019 implements MigrationInterface {
    name = 'AddedRefreshTokenToUserTable1781467167019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
