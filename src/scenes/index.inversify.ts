import { AddPasswordScene, addPasswordSceneType } from './addPassport.scenes';
import { AppealScene, appealSceneType } from './appeal.scenes';
import { ReplyStudent, ReplyStudentType } from './replyStudent.scenes';

export interface IRepositoryInversify {
  key: symbol;
  repository: object;
}
export const InversifyRepositoryScenes: Array<IRepositoryInversify> = [
  { key: addPasswordSceneType, repository: AddPasswordScene },
  { key: appealSceneType, repository: AppealScene },
  { key: ReplyStudentType, repository: ReplyStudent },
];
