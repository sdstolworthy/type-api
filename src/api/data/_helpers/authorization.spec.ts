/* tslint:disable no-unused-expression newline-per-chained-call */
import { Connection, createConnection } from 'typeorm'
import settings from '../../../config/settings'
import { Permission } from '../permission/permission.entity'
import { Role } from '../role/role.entity'
import { User } from '../user/user.entity'
import { needsPermission, PermissionValues } from './authorization'

describe('authorization helper', () => {
  let connection: Connection
  let user: User

  beforeAll(async () => {
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

    user = await User.create({
      email: 'test@example.com',
      password: 'password',
    }).save()
  })

  it("should throw an error if a user doesn't have permissions", () => {
    return
  })
})
