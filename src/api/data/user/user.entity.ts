import { IsEmail } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'
import generateGravatarUrl from '../_helpers/generateGravatarUrl'

@Entity({
  name: 'users',
})
export class User extends AltamirEntity {
  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string

  @Column({ select: false })
  public password: string

  @Column()
  public gravatarUrl: string

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

  @BeforeInsert()
  @BeforeUpdate()
  private updateGravatar() {
    this.gravatarUrl = generateGravatarUrl(this.email)
  }
}
