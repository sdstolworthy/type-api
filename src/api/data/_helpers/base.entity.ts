import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class AltamirEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  public updatedAt: Date

  // soft delete
  // https://github.com/typeorm/typeorm/issues/534
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public deletedAt: Date
}
