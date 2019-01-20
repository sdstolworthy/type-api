import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/baseEntity'

@Entity()
export class User extends AltamirEntity {
  @Index({ unique: true })
  @Column()
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
