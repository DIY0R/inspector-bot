import { Context, session } from 'telegraf';
import { SceneContext, SceneContextScene } from 'telegraf/scenes';
export enum LanEnum {
  RUSS = 'RUSS',
  ENG = 'ENG',
  UZB = 'UZB',
}
export enum RoleEnum {
  INSPECTOR = 'INSPECTOR',
  STUDENT = 'STUDENT',
}

export interface SessionData {
  lan: LanEnum;
  role: RoleEnum;
  replyId: number;
}
export interface IBotContext extends Context {
  session: SessionData;
  scene: SceneContextScene<SceneContext<IBotContext>, IBotContext>;
}
