/* tslint:disable no-unused-expression newline-per-chained-call */
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { Connection, createConnection } from 'typeorm'
import { connectionOptions } from '../../../config/db'
import { Permission } from '../permission/permission.entity'
import { Role } from '../role/role.entity'
import { User } from '../user/user.entity'
import { needsPermission, PermissionValues } from './authorization'

describe('authorization helper', () => {
  let connection: Connection
  let user: User
  let role: Role
  let readOnlyRolePermission: Permission

  beforeAll(async () => {
    connection = await createConnection(connectionOptions)

    readOnlyRolePermission = await Permission.findOneOrFail({
      value: PermissionValues.CAN_READ_ROLE,
    })

    role = await Role.create({
      name: 'Test role to read roles but not write them',
      permissions: [readOnlyRolePermission],
    }).save()

    user = await User.create({
      email: 'test@example.com',
      password: 'password',
      roles: [role],
    }).save()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should throw an AuthenticationError if the user is empty', async () => {
    expect.assertions(1)
    try {
      await needsPermission(undefined, PermissionValues.CAN_WRITE_ROLE)
    } catch (e) {
      expect(e).toBeInstanceOf(AuthenticationError)
    }
  })

  it("should throw a ForbiddenError if a user doesn't have permissions", async () => {
    expect.assertions(1)
    try {
      await needsPermission(user, PermissionValues.CAN_WRITE_ROLE)
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError)
    }
  })

  it('should return "true" if a user has the proper permission', async () => {
    await expect(needsPermission(user, PermissionValues.CAN_READ_ROLE)).resolves
      .toBeTruthy
  })
})
