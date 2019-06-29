import { MigrationInterface, QueryRunner } from 'typeorm'
import settings from '../../config/settings'

export class permissionValues1550598316380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `INSERT INTO "${settings.dbTablePrefix}permissions" ("value") VALUES ('can read role')`,
    )
    await queryRunner.query(
      `INSERT INTO "${settings.dbTablePrefix}permissions" ("value") VALUES ('can write role')`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `TRUNCATE "${settings.dbTablePrefix}permissions" CASCADE`,
    )
  }
}
