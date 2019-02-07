/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import settings from '../../../config/settings'
import { Permission, PermissionValues } from './permission.entity'

describe('permission entity', () => {
  let connection: Connection
  const testEntity = {
    value: PermissionValues.CAN_READ_ROLE,
  }

  beforeEach(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: [
        'src/**/*.entity.ts',
      ],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
  })

  afterEach(async () => {
    await connection.close()
  })

  it('should have an id field of type number', (done) => {
    Permission.create(testEntity).save().then((permission) => {
      expect(permission).to.haveOwnProperty('id')
      expect(permission.id).to.be.a('number')
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    Permission.create(testEntity).save().then((permission) => {
      expect(permission).to.haveOwnProperty('createdAt')
      expect(permission.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    Permission.create(testEntity).save().then((permission) => {
      expect(permission).to.haveOwnProperty('updatedAt')
      expect(permission.updatedAt).to.be.a('Date')
      done()
    })
  })
})
