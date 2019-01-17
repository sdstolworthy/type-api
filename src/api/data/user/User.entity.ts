import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'
import {Photo} from '../photo/Photo.entity'

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
    type: 'timestamp with time zone',
    nullable: true,
    select: false,
  })
  public resetPasswordExpires: Date

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    select: false,
  })
  public lastPasswordReset: Date

  @OneToMany(() => Photo, (photo) => photo.user)
  public photos: Photo[]
}
