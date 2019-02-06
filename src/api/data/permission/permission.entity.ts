import { Column, Entity } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

export enum PermissionValues {
  CAN_CREATE_POST = 'can create post',
  CAN_READ_POST = 'can read post',
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
