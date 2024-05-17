import { Chat } from '@telegraf/types';

export interface BotCommand {
  command: string;
  description: string;
}
export interface InaccessibleMessageMy {
  chat: Chat;
  message_id: number;
  date: 0;
  text: string;
}
