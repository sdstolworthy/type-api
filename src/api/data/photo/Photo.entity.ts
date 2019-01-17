import { Column, Entity, ManyToOne } from 'typeorm'
import { AltamirEntity } from '../_helpers/base.entity'
import { User } from '../user/User.entity'

@Entity()
export class Photo extends AltamirEntity {

    @Column()
    public filename: string

    @Column()
    public userId: number // must be declared before the ManyToOne field

    @ManyToOne(() => User, (user) => user.photos)
    public user: User

}
