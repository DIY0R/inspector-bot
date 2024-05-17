import { NarrowedContext, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { inject, injectable } from 'inversify';
import { Scenes } from './scenes.class';
import { Message, Update } from '@telegraf/types';
import { BaseScene } from 'telegraf/scenes';
import { backIcon, keyBoards } from '../keybords/keybords';
import {
  AppealRepository,
  AppealRepositoryType,
} from '../repositories/appeal.repository';

export const ReplyStudentName = 'ReplyStudentScene';
export const ReplyStudentType = Symbol.for(ReplyStudentName);

@injectable()
export class ReplyStudent extends Scenes {
  constructor(
    @inject(Symbol.for('bot')) public readonly botInject: Telegraf<IBotContext>,
    @inject(AppealRepositoryType)
    private readonly appealRepository: AppealRepository
  ) {
    super(botInject);
  }
  scene(): BaseScene<IBotContext> {
    const ReplyStudentScene = new BaseScene<IBotContext>(ReplyStudentName);

    const leave = async (
      ctx: NarrowedContext<IBotContext, Update.MessageUpdate<Message>>
    ) => {
      ctx.session.replyId = 0;
      await ctx.scene.leave();

      await ctx.reply(
        'Menu',
        keyBoards.getKeyBoard(ctx.session.lan, ctx.session.role)
      );
    };
    ReplyStudentScene.hears(backIcon, async (ctx) => {
      await leave(ctx);
    });
    ReplyStudentScene.on('message', async (ctx) => {
      try {
        const message = ctx.message as Message.TextMessage;
        if (message.text[0] == '/') return await leave(ctx);
        const text = `Javob ➡️: <b><i>${message.text}</i></b>`;

        const sendedMsg = await ctx.telegram.sendMessage(
          ctx.session.replyId,
          text,
          { parse_mode: 'HTML' }
        );

        await ctx.reply('Javob yuborildi✅!');
        await leave(ctx);
      } catch (error) {
        await ctx.reply(`Xato! Bot bloklangan bo'lishi mumkin‼️`);
        await leave(ctx);
      }
    });
    ReplyStudentScene.enter((ctx) => {
      ctx.reply('Yozing !', keyBoards.getBackIcon());
    });
    return ReplyStudentScene;
  }
}
