import { EntityManager } from 'typeorm'
import { Controller, Mutation, Query } from 'vesper'
import { Photo } from './Photo.entity'
import { IPhotoSaveArgs } from './PhotoSaveArgs'

@Controller()
export class PhotoController {

    constructor(private entityManager: EntityManager) {
    }

    @Query()
    public photos(): Promise<Photo[]> {
        return this.entityManager.find(Photo)
    }

    @Query()
    public photo({ id }: { id: number }): Promise<Photo> {
        return this.entityManager.findOne(Photo, id)
    }

    @Mutation()
    public async photoSave(args: IPhotoSaveArgs): Promise<Photo> {
        const photo = args.id ? await this.entityManager.findOne(Photo, args.id) : new Photo()
        photo.filename = args.filename
        photo.userId = args.userId
        return this.entityManager.save(photo)
    }

    @Mutation()
    public async photoDelete({ id }: { id: number }): Promise<boolean> {
        const photo = await this.entityManager.findOne(Photo, id)
        await this.entityManager.remove(photo)
        return true
    }

}
