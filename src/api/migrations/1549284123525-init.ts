import {MigrationInterface, QueryRunner} from "typeorm";

export class init1549284123525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "app_posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "body" character varying, CONSTRAINT "PK_fe36095e6a37d195feb58d50ba3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "gravatarUrl" character varying NOT NULL, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP WITH TIME ZONE, "lastPasswordReset" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9b97e4fbff9c2f3918fda27f999" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_14241fb016a330600a7e0efae9" ON "app_users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_14241fb016a330600a7e0efae9"`);
        await queryRunner.query(`DROP TABLE "app_users"`);
        await queryRunner.query(`DROP TABLE "app_posts"`);
    }

}
