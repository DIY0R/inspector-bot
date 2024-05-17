import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../../context/context.interface';

@Entity()
export class AdminModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: RoleEnum.STUDENT })
  role: RoleEnum;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;
}
