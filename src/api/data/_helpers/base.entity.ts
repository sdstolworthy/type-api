import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class AltamirEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // soft delete
  // https://github.com/typeorm/typeorm/issues/534
  @Column({ nullable: true })
  deletedAt: Date
}
