import { MigrationInterface, QueryRunner } from 'typeorm'
import settings from '../../config/settings'

export class init1549655489569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "${settings.dbTablePrefix}permissions_value_enum" AS ENUM('can read role', 'can write role')`,
    )
    await queryRunner.query(
      `CREATE TABLE "${settings.dbTablePrefix}permissions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "value" "${settings.dbTablePrefix}permissions_value_enum" NOT NULL, CONSTRAINT "UQ_406a19ca3a2f218ca24aa7361aa" UNIQUE ("value"), CONSTRAINT "PK_2ffc521a3e9b111cab3dbcca274" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "${settings.dbTablePrefix}roles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, CONSTRAINT "PK_1dab358fe21b705367e3a7194c0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "${settings.dbTablePrefix}users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "gravatarUrl" character varying NOT NULL, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP WITH TIME ZONE, "lastPasswordReset" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9b97e4fbff9c2f3918fda27f999" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_14241fb016a330600a7e0efae9" ON "${settings.dbTablePrefix}users" ("email") `,
    )
    await queryRunner.query(
      `CREATE TABLE "${settings.dbTablePrefix}roles_permissions_permissions" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "PK_a9e699da368ae49ba607eaea8b0" PRIMARY KEY ("rolesId", "permissionsId"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "${settings.dbTablePrefix}users_roles_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_cd68bf61f86aae7adda05589858" PRIMARY KEY ("usersId", "rolesId"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}roles_permissions_permissions" ADD CONSTRAINT "FK_7351ce59892762654ba0e8f0fbe" FOREIGN KEY ("rolesId") REFERENCES "${settings.dbTablePrefix}roles"("id") ON DELETE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}roles_permissions_permissions" ADD CONSTRAINT "FK_430c948a5502a90638619820c87" FOREIGN KEY ("permissionsId") REFERENCES "${settings.dbTablePrefix}permissions"("id") ON DELETE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}users_roles_roles" ADD CONSTRAINT "FK_4d5f057bd753ecf3de2bc80b3a8" FOREIGN KEY ("usersId") REFERENCES "${settings.dbTablePrefix}users"("id") ON DELETE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}users_roles_roles" ADD CONSTRAINT "FK_efad956533703b2e3ba0aaaf972" FOREIGN KEY ("rolesId") REFERENCES "${settings.dbTablePrefix}roles"("id") ON DELETE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}users_roles_roles" DROP CONSTRAINT "FK_efad956533703b2e3ba0aaaf972"`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}users_roles_roles" DROP CONSTRAINT "FK_4d5f057bd753ecf3de2bc80b3a8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}roles_permissions_permissions" DROP CONSTRAINT "FK_430c948a5502a90638619820c87"`,
    )
    await queryRunner.query(
      `ALTER TABLE "${settings.dbTablePrefix}roles_permissions_permissions" DROP CONSTRAINT "FK_7351ce59892762654ba0e8f0fbe"`,
    )
    await queryRunner.query(
      `DROP TABLE "${settings.dbTablePrefix}users_roles_roles"`,
    )
    await queryRunner.query(
      `DROP TABLE "${settings.dbTablePrefix}roles_permissions_permissions"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_14241fb016a330600a7e0efae9"`)
    await queryRunner.query(`DROP TABLE "${settings.dbTablePrefix}users"`)
    await queryRunner.query(`DROP TABLE "${settings.dbTablePrefix}roles"`)
    await queryRunner.query(`DROP TABLE "${settings.dbTablePrefix}permissions"`)
    await queryRunner.query(
      `DROP TYPE "${settings.dbTablePrefix}permissions_value_enum"`,
    )
  }
}
