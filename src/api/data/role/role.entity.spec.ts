/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
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
    Role.create(testEntity).save().then((role) => {
      expect(role).to.haveOwnProperty('id')
      expect(role.id).to.be.a('number')
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    Role.create(testEntity).save().then((role) => {
      expect(role).to.haveOwnProperty('createdAt')
      expect(role.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    Role.create(testEntity).save().then((role) => {
      expect(role).to.haveOwnProperty('updatedAt')
      expect(role.updatedAt).to.be.a('Date')
      done()
    })
  })
})
