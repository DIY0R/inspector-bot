import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PhoneModel } from './models/phone.model';
import { AdminModel } from './models/admins.model';
import { DataStudentModel } from './models/dataStudents.model';
import { PasportModel } from './models/pasport.model';
import { AppealModel } from './models/appeal.model';
import { ConfigService } from '../config/config.service';

const configService = new ConfigService();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.getKey('HOST'),
  port: +configService.getKey('PORT'),
  username: configService.getKey('USERNAME'),
  password: configService.getKey('PASSWORD'),
  database: configService.getKey('DATABASE'),
  entities: [
    PhoneModel,
    AdminModel,
    DataStudentModel,
    PasportModel,
    AppealModel,
  ],
  synchronize: true,
  logging: false,
});
