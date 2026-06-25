import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1781418788536 implements MigrationInterface {
    name = 'Initial1781418788536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('seeker', 'employer')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'seeker', "googleId" character varying, "avatar" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "location" character varying, "industry" character varying, "website" character varying, "logo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "REL_6dcdcbb7d72f64602307ec4ab3" UNIQUE ("ownerId"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."jobs_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'internship', 'remote')`);
        await queryRunner.query(`CREATE TYPE "public"."jobs_experiencelevel_enum" AS ENUM('entry', 'mid', 'senior', 'lead')`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "location" character varying, "type" "public"."jobs_type_enum" NOT NULL, "experienceLevel" "public"."jobs_experiencelevel_enum" NOT NULL, "salaryMin" integer, "salaryMax" integer, "isOpen" boolean NOT NULL DEFAULT true, "cereatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."applications_status_enum" AS ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')`);
        await queryRunner.query(`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."applications_status_enum" NOT NULL DEFAULT 'pending', "coverLetter" text, "appliedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "jobId" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("usersId" uuid NOT NULL, "skillsId" uuid NOT NULL, CONSTRAINT "PK_a1956708fe44a84d2d858f76d74" PRIMARY KEY ("usersId", "skillsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_19ca921ee3aaf5e04b07d1d74e" ON "user_skills"  ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c3eeaeb05e6b3b509e3135bbc" ON "user_skills"  ("skillsId") `);
        await queryRunner.query(`CREATE TABLE "job_skills" ("jobsId" uuid NOT NULL, "skillsId" uuid NOT NULL, CONSTRAINT "PK_63b0a2bc06aeb7ea5bc99af781a" PRIMARY KEY ("jobsId", "skillsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c9538138417528a2962569d786" ON "job_skills"  ("jobsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b1a28c4b20fa9b1266b8bbf85" ON "job_skills"  ("skillsId") `);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_19ca921ee3aaf5e04b07d1d74e2" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_0c3eeaeb05e6b3b509e3135bbcb" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_skills" ADD CONSTRAINT "FK_c9538138417528a2962569d786f" FOREIGN KEY ("jobsId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "job_skills" ADD CONSTRAINT "FK_7b1a28c4b20fa9b1266b8bbf85b" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT "FK_7b1a28c4b20fa9b1266b8bbf85b"`);
        await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT "FK_c9538138417528a2962569d786f"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_0c3eeaeb05e6b3b509e3135bbcb"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_19ca921ee3aaf5e04b07d1d74e2"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b1a28c4b20fa9b1266b8bbf85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9538138417528a2962569d786"`);
        await queryRunner.query(`DROP TABLE "job_skills"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c3eeaeb05e6b3b509e3135bbc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19ca921ee3aaf5e04b07d1d74e"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_experiencelevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_type_enum"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "skills"`);
    }

}
