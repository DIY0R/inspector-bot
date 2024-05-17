import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhoneModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  TelNumber: string;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;
}
