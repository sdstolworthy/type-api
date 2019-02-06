import { AuthenticationError } from 'apollo-server-express'
import { User } from '../user/user.entity'

export { PermissionValues } from '../permission/permission.entity'

/**
 * Throws an error if a user doesn't have the proper permissions.
 * @function
 * @param {object} context - the Apollo request context
 * @param {string} permissionValue - the permission required from permission.PermissionValues
 */
export const needsPermission = (context: any, permissionValue: string) => {
  if (!context.permissions || !context.permissions.includes(permissionValue)) {
    throw new AuthenticationError("The user doesn't have permission to do that.")
  }
  return true
}

export const getUserPermissions = async (user: User) => {
  if (!user) { return [] }

  const permissionsRaw: any[] = await User.createQueryBuilder('user')
    .leftJoin('user.roles', 'role')
    .leftJoin('role.permissions', 'permission')
    .select([
      'permission.value',
    ])
    .where('user.id = :id', { id: user.id })
    .getRawMany()

  /**
   * getRawMany returns an array of objects. We just want an array of strings.
   * Clean up the array of objects to return a sensible array.
   */
  const permissions: string[] = []
  permissionsRaw.forEach((p) => {
    if (!permissions.includes(p.permission_value)) {
      permissions.push(p.permission_value)
    }
  })

  return permissions
}
