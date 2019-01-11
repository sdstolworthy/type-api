import { Column, Entity, Index, OneToMany } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'
import {Photo} from '../photo/Photo.entity'

@Entity()
export class User extends AltamirEntity {
  @Index({ unique: true })
  @Column()
  email: string

  @Column({ select: false })
  password: string

  @Column({
    nullable: true,
    select: false,
  })
  resetPasswordToken: string

  @Column({
    nullable: true,
    select: false,
  })
  resetPasswordExpires: Date

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[]
}
