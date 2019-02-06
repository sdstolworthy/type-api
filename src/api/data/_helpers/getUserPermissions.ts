import { logger } from '../../../config/logger'
import { User } from '../user/user.entity'

export default async (user: User) => {
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
