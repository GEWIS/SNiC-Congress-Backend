import {
  CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, BaseEntity,
} from 'typeorm';

export default class BaseEnt extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @CreateDateColumn({ update: false })
  readonly createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @VersionColumn()
    version: number;
}
