import { Column, Entity } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

export enum PermissionValues {
  CAN_READ_ROLE = 'can read role',
  CAN_WRITE_ROLE = 'can write role',
}

@Entity({ name: 'permissions' })
export class Permission extends AltamirEntity {
  @Column({
    unique: true,
    type: 'enum',
    enum: PermissionValues,
  })
  public value: PermissionValues
}
