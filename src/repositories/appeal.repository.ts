import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { AdminModel } from '../db/models/admins.model';
import { PasportModel } from '../db/models/pasport.model';
import { DataStudentModel } from '../db/models/dataStudents.model';
import { AppealModel } from '../db/models/appeal.model';
import { PhoneModel } from '../db/models/phone.model';
export const AppealRepositoryType = Symbol.for('AppealRepositoryType');

@injectable()
export class AppealRepository {
  constructor(
    @inject(Symbol.for('dataBase'))
    private readonly dataSource: DataSource
  ) {}

  async getAdmins() {
    const adminsRepository = await this.dataSource.getRepository(AdminModel);
    const admins = await adminsRepository.find();
    return admins;
  }
  async getStudentInfo(telegramId: number): Promise<DataStudentModel | null> {
    const passportRepository = await this.dataSource.getRepository(
      PasportModel
    );
    const dataStudentsRepository = await this.dataSource.getRepository(
      DataStudentModel
    );
    const pasport = await passportRepository.findOneBy({ telegramId });
    const dataStudents = await dataStudentsRepository.findOneBy({
      pasportId: pasport!.pasportId,
    });
    return dataStudents;
  }
  async getAppeals(): Promise<AppealModel[]> {
    const appealRepository = await this.dataSource.getRepository(AppealModel);
    const appeals = await appealRepository.find({
      relations: { student: true },
    });

    return appeals;
  }
  async getPhoneNum(telegramId: number) {
    const phoneRep = await this.dataSource.getRepository(PhoneModel);
    const phoneNum = await phoneRep.findOneBy({ telegramId });
    return phoneNum?.TelNumber;
  }
  async addAppeal(telegramId: number, text: string, tellNum: string) {
    try {
      const passportRepository = await this.dataSource.getRepository(
        PasportModel
      );
      const dataStudentsRepository = await this.dataSource.getRepository(
        DataStudentModel
      );
      const appealRepository = await this.dataSource.getRepository(AppealModel);
      const pasport = await passportRepository.findOneBy({ telegramId });

      const dataStudents = await dataStudentsRepository.findOne({
        where: { pasportId: pasport!.pasportId },
        relations: {
          appeals: true,
        },
      });
      const newAppeal = new AppealModel();
      newAppeal.text = text;
      newAppeal.tellNum = tellNum;
      dataStudents?.appeals.push(newAppeal);
      if (dataStudents) {
        await appealRepository.save(newAppeal);
        await dataStudentsRepository.save(dataStudents);
      }
    } catch (error) {
      console.error('error', error);
    }
  }
}
