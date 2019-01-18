import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

@Entity()
export class Post extends AltamirEntity {
  @Column()
  public title: string

  @Column()
  public body: string
}
