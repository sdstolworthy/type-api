/* tslint:disable no-unused-expression newline-per-chained-call */
import { Connection, createConnection } from 'typeorm'
import settings from '../../../config/settings'
import { Permission, PermissionValues } from './permission.entity'

// https://stackoverflow.com/a/24968449/5623385
function getDuplicateArrayValues(array: string[]): string[] {
  const unique = array
    .map((val: string) => {
      return { count: 1, val }
    })
    .reduce((a, b) => {
      a[b.val] = (a[b.val] || 0) + b.count
      return a
    }, {})

  const duplicates: string[] = Object.keys(unique).filter((a) => unique[a] > 1)
  return duplicates
}

describe('permission entity', () => {
  let connection: Connection
  const testEntity = {
    value: PermissionValues.CAN_READ_ROLE,
  }
  let permission: Permission

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: ['src/**/*.entity.ts'],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
    permission = await Permission.create(testEntity).save()
  })

  beforeAll(async () => {
    await connection.close()
  })

  it('should have an id field of type number', async () => {
    expect(permission).toHaveProperty('id')
    expect(typeof permission.id).toBe('number')
  })

  it('should have a createdAt field of type date', async () => {
    expect(permission).toHaveProperty('createdAt')
    expect(typeof permission.createdAt.getMonth).toBe('function')
  })

  it('should have an updatedAt field of type date', async () => {
    expect(permission).toHaveProperty('updatedAt')
    expect(typeof permission.updatedAt.getMonth).toBe('function')
  })

  it('should have only unique values in the PermissionValues enum', async () => {
    const permissionValuesArray: any[] = []
    Object.keys(PermissionValues).forEach((key) => {
      permissionValuesArray.push(PermissionValues[key])
    })

    expect(getDuplicateArrayValues(permissionValuesArray)).toHaveLength(0)
  })
})
