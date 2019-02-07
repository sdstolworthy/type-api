import { Seed } from '../_helpers/seed'
import { Permission, PermissionValues } from './permission.entity'

const seeds: any[] = []

Object.keys(PermissionValues).forEach((key) => {
  seeds.push({ value: PermissionValues[key] })
})

const seed: Seed = new Seed(Permission, seeds)

seed.write()

export default seed
