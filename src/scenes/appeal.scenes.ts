import { NarrowedContext, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { inject, injectable } from 'inversify';
import { Scenes } from './scenes.class';
import { Message, Update } from '@telegraf/types';
import { BaseScene } from 'telegraf/scenes';
import { backIcon, buttonsReply, keyBoards } from '../keybords/keybords';
import {
  AppealRepository,
  AppealRepositoryType,
} from '../repositories/appeal.repository';
import { InaccessibleMessageMy } from '../types/botCommands';
import { ReplyStudentName } from './replyStudent.scenes';

export const appealSceneName = 'AppealScene';
export const appealSceneType = Symbol.for(appealSceneName);
@injectable()
export class AppealScene extends Scenes {
  constructor(
    @inject(Symbol.for('bot')) public readonly botInject: Telegraf<IBotContext>,
    @inject(AppealRepositoryType)
    private readonly appealRepository: AppealRepository
  ) {
    super(botInject);
  }
  scene(): BaseScene<IBotContext> {
    const appealScene = new BaseScene<IBotContext>(appealSceneName);
    appealScene.enter((ctx) => {
      ctx.reply('Yozing !', keyBoards.getBackIcon());
    });
    const leave = async (
      ctx: NarrowedContext<IBotContext, Update.MessageUpdate<Message>>
    ) => {
      await ctx.scene.leave();
      await ctx.reply(
        'Menu',
        keyBoards.getKeyBoard(ctx.session.lan, ctx.session.role)
      );
    };
    appealScene.hears(backIcon, async (ctx) => {
      await leave(ctx);
    });
    appealScene.on('message', async (ctx) => {
      try {
        const message = ctx.message as Message.TextMessage;
        if (message.text.trim()[0] == '/') return await leave(ctx);
        const getStudentInfo = await this.appealRepository.getStudentInfo(
          ctx.chat.id
        );
        const getPhoneNum = await this.appealRepository.getPhoneNum(
          ctx.chat.id
        );
        if (!getStudentInfo || !getPhoneNum)
          return ctx.reply('Murojaat yuborilmadi! ❌!');
        const text = `
      ID:${ctx.chat.id}:\n\n
      
      <b>Murojaat </b>: <i>${message.text}</i>\n\n
      <b>Tel</b> <code>${getPhoneNum}</code>
      <b>To‘liq ismi: </b> ${getStudentInfo.name}
      <b>Pasport raqami</b>: ${getStudentInfo.pasportId} 
      <b>JSHSHIR kod</b>:${getStudentInfo.JSHSHIR_Kod} 
      <b>Kurs</b>:${getStudentInfo.kurs}
      <b>Fakultet</b>:${getStudentInfo.fakultet}
      <b>Guruh</b>:${getStudentInfo.guruh}
      <b>Ta’lim shakli</b>:${getStudentInfo.talimShakli}
      <b>Telegram:</b>t.me/${getPhoneNum}
      `;
        const admins = await this.appealRepository.getAdmins();

        for (const item of admins) {
          const sendedMsg = await ctx.telegram.sendMessage(
            item.telegramId,
            text,
            {
              parse_mode: 'HTML',
              reply_markup: { inline_keyboard: buttonsReply },
            }
          );
        }
        await ctx.reply('Murojaat yuborildi ✅!');
        await leave(ctx);
      } catch (error) {
        await leave(ctx);
      }
    });

    this.bot.action('reply', async (ctx) => {
      const message = ctx.callbackQuery.message as InaccessibleMessageMy;
      const text = message.text;

      const idRegex = /ID:\s*(\d+)/;
      const idMatch = text.match(idRegex);

      if (idMatch) {
        const id = idMatch[1];
        ctx.session.replyId = +id;
        await ctx.scene.enter(ReplyStudentName);
      } else {
        ctx.reply('ID not found');
      }
      ctx.answerCbQuery('Javob bering');
    });
    return appealScene;
  }
}
