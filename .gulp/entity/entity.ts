import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

@Entity({
  name: '<%= entityName%>s',
})
export class <%= entityName[0].toUpperCase() + entityName.slice(1) %> extends AltamirEntity {
  @Column()
  public title: string

  @Column({ nullable: true })
  public body: string
}
