import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'

@Entity()
export class yolo extends AltamirEntity {
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
