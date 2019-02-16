/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import settings from '../../../config/settings'
import { {{ capitalize entityName }} } from './{{ entityName }}.entity'

describe('{{ entityName }} entity', () => {
  let connection: Connection
  const testEntity = {
    title: 'Test title for {{ capitalize entityName }}',
    body: 'Test body for {{ capitalize entityName }}',
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
    {{ capitalize entityName }}.create(testEntity).save().then(({{ entityName }}) => {
      expect({{ entityName }}).to.haveOwnProperty('id')
      expect({{ entityName }}.id).to.be.a('number')
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    {{ capitalize entityName }}.create(testEntity).save().then(({{ entityName }}) => {
      expect({{ entityName }}).to.haveOwnProperty('createdAt')
      expect({{ entityName }}.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    {{ capitalize entityName }}.create(testEntity).save().then(({{ entityName }}) => {
      expect({{ entityName }}).to.haveOwnProperty('updatedAt')
      expect({{ entityName }}.updatedAt).to.be.a('Date')
      done()
    })
  })
})
