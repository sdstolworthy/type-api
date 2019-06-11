/* tslint:disable no-unused-expression newline-per-chained-call */
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import settings from '../../../config/settings'
import { Role } from './role.entity'

describe('role entity', () => {
  let connection: Connection
  const testEntity = {
    name: 'Generic user',
  }

  beforeEach(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: ['src/**/*.entity.ts'],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
  })

  afterEach(async () => {
    await connection.close()
  })

  it('should have an id field of type number', async () => {
    const role: Role = await Role.create(testEntity).save()
    expect(role).toHaveProperty('id')
    expect(typeof role.id).toBe('number')
  })

  it('should have a createdAt field of type date', async () => {
    const role: Role = await Role.create(testEntity).save()
    expect(role).toHaveProperty('createdAt')
    expect(typeof role.createdAt.getMonth).toBe('function')
  })

  it('should have an updatedAt field of type date', async () => {
    const role: Role = await Role.create(testEntity).save()
    expect(role).toHaveProperty('updatedAt')
    expect(typeof role.updatedAt.getMonth).toBe('function')
  })
})
