import chalk from 'chalk'
import {
  Permission,
  PermissionValues,
} from '../../../api/data/permission/permission.entity'
import { logger } from '../../logger'

/**
 * Check that all values in the PermissionValues enum exist in the database. If
 * they don't log a warning.
 */
export const permissionValuesCheck: () => void = async () => {
  for (const name in PermissionValues) {
    if (PermissionValues.hasOwnProperty(name)) {
      const value: any = PermissionValues[name]

      const permission = await Permission.findOne({ value })

      if (!permission) {
        let msg: string = `The value "${value}" in the PermissionValues enum `
        msg += `doesn't exist in the database. You should probably add that to `
        msg += `a migration (see permissionValues migration). To be clear, `
        msg += `${chalk.red.bold('THIS CAN CAUSE SOME SERIOUS PROBLEMS.')}`
        logger.warn(msg)
      }
    }
  }
}
