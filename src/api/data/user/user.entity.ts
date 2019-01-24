import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

@Entity({
  name: 'users',
})
export class User extends AltamirEntity {
  @Column()
  @Index({ unique: true })
  public email: string

  @Column({ select: false })
  public password: string

  @Column({
    nullable: true,
    select: false,
  })
  public resetPasswordToken: string

  @Column({
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  public resetPasswordExpires: Date

  @Column({
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  public lastPasswordReset: Date
}
