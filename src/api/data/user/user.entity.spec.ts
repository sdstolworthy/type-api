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
    User.create(testUser).save().then((user) => {
      expect(user).to.haveOwnProperty('id')
      expect(user.id).to.be.a('number')
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    User.create(testUser).save().then((user) => {
      expect(user).to.haveOwnProperty('createdAt')
      expect(user.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    User.create(testUser).save().then((user) => {
      expect(user).to.haveOwnProperty('updatedAt')
      expect(user.updatedAt).to.be.a('Date')
      done()
    })
  })

  it('should have an email field of type string and is an email', (done) => {
    User.create(testUser).save().then((user) => {
      expect(user).to.haveOwnProperty('email')
      expect(user.email).to.be.a('String')
      expect(validator.isEmail(user.email)).to.be.true
      done()
    })
  })
})
