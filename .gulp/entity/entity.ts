import { Column, Entity } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

@Entity({ name: '{{ entityName }}s' })
export class {{ capitalize entityName }} extends AltamirEntity {
  @Column()
  public title: string

  @Column({ nullable: true })
  public body: string
}
