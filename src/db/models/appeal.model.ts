import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DataStudentModel } from './dataStudents.model';

@Entity()
export class AppealModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar' })
  tellNum: string;

  @ManyToOne(
    () => DataStudentModel,
    (dataStudentModel) => dataStudentModel.appeals
  )
  student: DataStudentModel;
}
