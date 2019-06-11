import { Connection, createConnection } from 'typeorm'
import {
  Permission,
  PermissionValues,
} from '../../../api/data/permission/permission.entity'
import settings from '../../settings'

describe('permission values check db hook', () => {
  let connection: Connection

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: ['../src/**/*.entity.ts'],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should not do anything if all permissions are in the database', () => {
    // TODO: check that it console.logs something
    expect(true).toBe(true)
  })
})
