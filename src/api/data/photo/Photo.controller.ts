import {Controller, Mutation, Query} from "vesper";
import {EntityManager} from "typeorm";
import {PhotoSaveArgs} from "./PhotoSaveArgs";
import {Photo} from "./Photo.entity";

@Controller()
export class PhotoController {

    constructor(private entityManager: EntityManager) {
    }

    @Query()
    photos(): Promise<Photo[]> {
        return this.entityManager.find(Photo);
    }

    @Query()
    photo({ id }: { id: number }): Promise<Photo> {
        return this.entityManager.findOne(Photo, id);
    }

    @Mutation()
    async photoSave(args: PhotoSaveArgs): Promise<Photo> {
        const photo = args.id ? await this.entityManager.findOne(Photo, args.id) : new Photo();
        photo.filename = args.filename;
        photo.userId = args.userId;
        return this.entityManager.save(photo);
    }

    @Mutation()
    async photoDelete({ id }: { id: number }): Promise<boolean> {
        const photo = await this.entityManager.findOne(Photo, id);
        await this.entityManager.remove(photo);
        return true;
    }

}
