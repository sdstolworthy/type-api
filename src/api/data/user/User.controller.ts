import { EntityManager, FindManyOptions } from 'typeorm'
import {Controller, Mutation, Query} from 'vesper'
import { User } from './User.entity'
import { IUsersArgs } from './UsersArgs'
import { IUserSaveArgs } from './UserSaveArgs'

@Controller()
export class UserController {

    constructor(private entityManager: EntityManager) {
    }

    @Query()
    users(args: IUsersArgs): Promise<User[]> {

        const findOptions: FindManyOptions = {}
        if (args.limit) {
          findOptions.skip = args.limit
        }
        if (args.offset) {
          findOptions.take = args.offset
        }

        return this.entityManager.find(User, findOptions)
    }

    @Query()
    user({ id }: { id: number }): Promise<User> {
        return this.entityManager.findOne(User, id)
    }

    @Mutation()
    async userSave(args: IUserSaveArgs): Promise<User> {
        const user = args.id ? await this.entityManager.findOne(User, args.id) : new User()
        user.email = args.email
        user.password = args.password
        return this.entityManager.save(user)
    }

    @Mutation()
    async userDelete({ id }: { id: number }): Promise<boolean> {
        const user = await this.entityManager.findOne(User, id)
        await this.entityManager.remove(user)
        return true
    }

}
