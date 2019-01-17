import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class AltamirEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  public updatedAt: Date

  // soft delete
  // https://github.com/typeorm/typeorm/issues/534
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  public deletedAt: Date
}
