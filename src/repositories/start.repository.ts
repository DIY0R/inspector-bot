import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { RoleEnum } from '../context/context.interface';
import { AdminModel } from '../db/models/admins.model';
import { PhoneModel } from '../db/models/phone.model';
import { DataStudentModel } from '../db/models/dataStudents.model';
import { PasportModel } from '../db/models/pasport.model';

export const StartRepositoryType = Symbol.for('StartRepositoryType');
@injectable()
export class StartRepository {
  constructor(
    @inject(Symbol.for('dataBase'))
    private readonly dataSource: DataSource
  ) {}
  async checkRole(telegramId: number, role: RoleEnum): Promise<boolean> {
    const userRepository = await this.dataSource.getRepository(AdminModel);
    const oneUser = await userRepository.findOneBy({ telegramId });
    return !!(oneUser?.role == role);
  }
  async checkPasportIdData(pasportId: string): Promise<boolean> {
    try {
      const StudentsDataRepository = await this.dataSource.getRepository(
        DataStudentModel
      );
      const oneUser = await StudentsDataRepository.findOneBy({
        pasportId: pasportId.trim().toUpperCase(),
      });
      return !!oneUser;
    } catch (error) {
      return false;
    }
  }
  async checkPasportId(telegramId: number): Promise<boolean> {
    try {
      const pasportRepository = await this.dataSource.getRepository(
        PasportModel
      );
      const oneUser = await pasportRepository.findOneBy({
        telegramId,
      });
      return !!oneUser;
    } catch (error) {
      return false;
    }
  }
  async addPasport(telegramId: number, pasportId: string) {
    try {
      const newPasportId = new PasportModel();
      newPasportId.pasportId = pasportId;
      newPasportId.telegramId = telegramId;
      const repositoryPasportId = await this.dataSource.getRepository(
        PasportModel
      );
      await repositoryPasportId.save(newPasportId);
      return `Qo'shildi!`;
    } catch (error) {
      console.error(error);
      return 'Xatolik';
    }
  }

  async checkPhone(telegramId: number): Promise<boolean> {
    const StudentsRepository = await this.dataSource.getRepository(PhoneModel);
    const oneUser = await StudentsRepository.findOneBy({
      telegramId,
    });
    return !!oneUser;
  }
  async addPhone(telegramId: number, phoneNumber: string): Promise<string> {
    try {
      const newStudentsModel = new PhoneModel();
      newStudentsModel.TelNumber = phoneNumber;
      newStudentsModel.telegramId = telegramId;
      const StudentsRepository = await this.dataSource.getRepository(
        PhoneModel
      );
      await StudentsRepository.save(newStudentsModel);
      return 'saqlandi!';
    } catch (error) {
      console.error(error);
      return 'Qanaqdir hato!';
    }
  }
}
