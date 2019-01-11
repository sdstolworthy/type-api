import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm";
import {User} from "../user/User.entity";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.photos)
    user: User;

}
