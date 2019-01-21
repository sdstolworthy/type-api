/* tslint:disable no-unused-expression */
import { expect } from 'chai'
import 'mocha'
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import settings from '../../../config/settings'
import { <%= entityName[0].toUpperCase() + entityName.slice(1) %> } from './<%= entityName %>.entity'

describe('<%= entityName %> entity', () => {
  let connection: Connection
  const testEntity = {
    title: 'Test title for <%= entityName[0].toUpperCase() + entityName.slice(1) %>',
    body: 'Test body for <%= entityName[0].toUpperCase() + entityName.slice(1) %>',
  }

  beforeEach(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbPostgresTestUrl,
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

  it('should have an id field of type uuid', (done) => {
    <%= entityName[0].toUpperCase() + entityName.slice(1) %>.create(testEntity).save().then((<%= entityName %>) => {
      expect(<%= entityName %>).to.haveOwnProperty('id')
      expect(validator.isUUID(<%= entityName %>.id)).to.be.true
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    <%= entityName[0].toUpperCase() + entityName.slice(1) %>.create(testEntity).save().then((<%= entityName %>) => {
      expect(<%= entityName %>).to.haveOwnProperty('createdAt')
      expect(<%= entityName %>.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    <%= entityName[0].toUpperCase() + entityName.slice(1) %>.create(testEntity).save().then((<%= entityName %>) => {
      expect(<%= entityName %>).to.haveOwnProperty('updatedAt')
      expect(<%= entityName %>.updatedAt).to.be.a('Date')
      done()
    })
  })
})
