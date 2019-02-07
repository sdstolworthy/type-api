import {MigrationInterface, QueryRunner} from "typeorm";

export class rolePermissions1549507196786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "app_permissions_value_enum" RENAME TO "app_permissions_value_enum_old"`);
        await queryRunner.query(`CREATE TYPE "app_permissions_value_enum" AS ENUM('can read role', 'can write role')`);
        await queryRunner.query(`ALTER TABLE "app_permissions" ALTER COLUMN "value" TYPE "app_permissions_value_enum" USING "value"::"text"::"app_permissions_value_enum"`);
        await queryRunner.query(`DROP TYPE "app_permissions_value_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "app_permissions_value_enum_old" AS ENUM('can create post', 'can read post')`);
        await queryRunner.query(`ALTER TABLE "app_permissions" ALTER COLUMN "value" TYPE "app_permissions_value_enum_old" USING "value"::"text"::"app_permissions_value_enum_old"`);
        await queryRunner.query(`DROP TYPE "app_permissions_value_enum"`);
        await queryRunner.query(`ALTER TYPE "app_permissions_value_enum_old" RENAME TO "app_permissions_value_enum"`);
    }

}
