/* tslint:disable no-unused-expression newline-per-chained-call */
import validator from 'validator'
import Database from '../../../config/db'
import { logger } from '../../../config/logger'
import settings from '../../../config/settings'
import { User } from './user.entity'

// https://github.com/typeorm/typeorm/issues/1267#issuecomment-350724511
describe('user entity', () => {
  const db: Database = new Database()
  let user: User
  const testUser = {
    email: 'test@example.com',
    password: 'password',
  }

  beforeAll((done) => {
    // connection = await createConnection({
    //   type: 'postgres',
    //   url: settings.dbTestUrl,
    //   entities: [
    //     'src/**/*.entity.ts',
    //   ],
    //   logging: false,
    //   dropSchema: true, // isolate each test case
    //   synchronize: true,
    // })
    db.init(done)
    User.create(testUser)
      .save()
      .then((result) => {
        user = result
        done()
      })
      .catch((err) => {
        logger.error(err)
        done()
      })
  })

  beforeAll((done) => {
    db.close(done)
  })

  it('should have an id field of type number', () => {
    // User.create(testUser).save().then((user) => {
    expect(user).toHaveProperty('id')
    expect(typeof user.id).toBe('number')
    //   done()
    // })
  })

  it('should have a createdAt field of type date', () => {
    // User.create(testUser).save().then((user) => {
      expect(user).toHaveProperty('createdAt')
      expect(typeof user.createdAt.getMonth).toBe('function')
    //   done()
    // })
  })

  it('should have an updatedAt field of type date', () => {
    // User.create(testUser).save().then((user) => {
      expect(user).toHaveProperty('updatedAt')
      expect(typeof user.updatedAt.getMonth).toBe('function')
    //   done()
    // })
  })

  it('should have an email field of type string and is an email', () => {
    // User.create(testUser).save().then((user) => {
      expect(user).toHaveProperty('email')
      expect(typeof user.email).toBe('string')
      expect(validator.isEmail(user.email)).toBeTruthy
    //   done()
    // })
  })
})
