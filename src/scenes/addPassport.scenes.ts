import { Context, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { inject, injectable } from 'inversify';
import { Scenes } from './scenes.class';
import { Message } from '@telegraf/types';
import { BaseScene } from 'telegraf/scenes';
import { backIcon, keyBoards } from '../keybords/keybords';
import {
  StartRepository,
  StartRepositoryType,
} from '../repositories/start.repository';

export const addPasswordScene = 'addPasswordScene';
export const addPasswordSceneType = Symbol.for(addPasswordScene);
@injectable()
export class AddPasswordScene extends Scenes {
  constructor(
    @inject(Symbol.for('bot')) public readonly botInject: Telegraf<IBotContext>,
    @inject(StartRepositoryType)
    private readonly startRepository: StartRepository
  ) {
    super(botInject);
  }
  scene(): BaseScene<IBotContext> {
    const passwordScene = new BaseScene<IBotContext>(addPasswordScene);
    passwordScene.enter((ctx) => {
      ctx.reply('Passport ID kiriting!', keyBoards.getBackIcon());
    });
    passwordScene.hears(backIcon, async (ctx) => {
      await ctx.scene.leave();
    });
    passwordScene.on('message', async (ctx, next) => {
      const message = ctx.message as Message.TextMessage;
      const dataStudent = await this.startRepository.checkPasportIdData(
        message.text.trim()
      );
      if (dataStudent) {
        const pasportId = message.text.toUpperCase();
        await this.startRepository.addPasport(ctx.chat.id, pasportId);
        await ctx.scene.leave();
        await ctx.reply('Topildi!✅ - ' + message.text.toUpperCase());
        return ctx.reply(
          'Assalomu alaykum!',
          keyBoards.getKeyBoard(ctx.session.lan, ctx.session.role)
        );
      }
      ctx.reply('Topilmadi ❌');
    });
    return passwordScene;
  }
}
