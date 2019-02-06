import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'
import { Permission } from '../permission/permission.entity'

@Entity({ name: 'roles' })
export class Role extends AltamirEntity {
  @Column()
  public name: string

  @ManyToMany((type) => Permission, {
    eager: true,
  })
  @JoinTable()
  public permissions: Permission[]
}
