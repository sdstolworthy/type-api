/* tslint:disable no-unused-expression */
import { expect } from 'chai'
import 'mocha'
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import settings from '../../../config/settings'
import { User } from './user.entity'

// https://github.com/typeorm/typeorm/issues/1267#issuecomment-350724511
describe('user entity', () => {
  let connection: Connection
  const testUser = {
    email: 'test@example.com',
    password: 'password',
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

  it('should have a uuid id field', (done) => {
    User.create(testUser).save().then((user) => {
      expect(user).to.haveOwnProperty('id')
      expect(validator.isUUID(user.id)).to.be.true
      done()
    })
  })
})
