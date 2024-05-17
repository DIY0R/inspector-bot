import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasportModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  pasportId: string;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;
}
