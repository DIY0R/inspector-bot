import { AppealRepository, AppealRepositoryType } from './appeal.repository';
import { StartRepository, StartRepositoryType } from './start.repository';
export interface IRepositoryInversify {
  key: symbol;
  repository: object;
}
export const InversifyRepository: Array<IRepositoryInversify> = [
  { key: StartRepositoryType, repository: StartRepository },
  { key: AppealRepositoryType, repository: AppealRepository },
];
