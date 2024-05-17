import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppealModel } from './appeal.model';

@Entity()
export class DataStudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  talabaId: number;

  @Column()
  name: string;

  @Column()
  pasportId: string;

  @Column({ name: 'JSHSHIR_Kod', type: 'bigint' })
  JSHSHIR_Kod: string;

  @Column()
  kurs: string;

  @Column()
  fakultet: string;

  @Column()
  guruh: string;

  @Column({ name: 'talimShakli' })
  talimShakli: string;
  @OneToMany(() => AppealModel, (appealModel) => appealModel.student)
  appeals: AppealModel[];
}
