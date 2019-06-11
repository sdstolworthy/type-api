/* tslint:disable no-unused-expression newline-per-chained-call */
import * as jwt from 'jsonwebtoken'
import { Connection, createConnection } from 'typeorm'
import settings from '../../config/settings'
import { User } from '../data/user/user.entity'
import getUserFromAuthHeader from './getUserFromAuthHeader'

/**
 * TODO:
 * - create user
 * - create JWT with user's ID
 * - create auth header with JWT
 * - run against the function
 */
describe('getUserFromAuthHeader helper function', () => {
  let connection: Connection
  let user: User

  const testUser = {
    email: 'test@example.com',
    password: 'password',
  }

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: ['src/**/*.entity.ts'],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })

    user = await User.create(testUser)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('returns {} if bearer token is empty', async () => {
    const result: any = await getUserFromAuthHeader('')

    expect(result).toEqual({})
  })

  it('returns {} if bearer token is expired', async () => {
    const token: string = jwt.sign(
      { id: user.id },
      settings.secretKey,
      { expiresIn: '1' }, // 1ms
    )
    const bearerToken: string = `Bearer ${token}`
    const result: any = await getUserFromAuthHeader(bearerToken)

    expect(result).toEqual({})
  })

  it('returns the user as an object if bearer token is valid', async () => {
    const token: string = jwt.sign({ id: user.id }, settings.secretKey, {
      expiresIn: '1d',
    })
    const bearerToken: string = `Bearer ${token}`
    const result: any = await getUserFromAuthHeader(bearerToken)

    expect(result.id).toEqual(user.id)
  })
})
