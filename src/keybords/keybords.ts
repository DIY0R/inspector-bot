import { Markup } from 'telegraf';
import { LanEnum, RoleEnum } from '../context/context.interface';
import { BotCommand } from '../types/botCommands';

const UzbKeyBoard = [['🖋 Murojaat qilish', `📑 Ma'lumot`]];
const RussKeyBoard = [
  ['🖋 Написать', `📑 Информация`],
  [`🇺🇿🇺🇸🇷🇺 Изменить язык`],
];
const EngKeyBoard = [['🖋 Write', `📑 information`], [`🇺🇿🇺🇸🇷🇺 Сhange language`]];

const AdminKeyBoard = [[`📑 Murojaatlar`]];

type LanKey = keyof typeof LanEnum;
const objLan: Record<LanKey, any> = {
  RUSS: RussKeyBoard,
  ENG: EngKeyBoard,
  UZB: UzbKeyBoard,
};
export const buttonsReply = [[{ text: 'Javob berish!', callback_data: 'reply' }]];
export const commands: BotCommand[] = [
  { command: 'start', description: 'restart' },
  { command: 'id', description: 'current id' },
];

export const backIcon = '🔙';
class KeyBoards {
  getKeyBoard(lan: LanEnum, role: RoleEnum) {
    if (role == RoleEnum.INSPECTOR)
      return Markup.keyboard(AdminKeyBoard).resize();
    return Markup.keyboard(objLan[lan]).resize();
  }

  getBackIcon() {
    return Markup.keyboard([[backIcon]]).resize();
  }
}
export const keyBoards = new KeyBoards();
