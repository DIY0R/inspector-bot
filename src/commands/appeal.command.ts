import { Telegraf } from 'telegraf';
import { IBotContext, RoleEnum } from '../context/context.interface';
import { Command } from './command.class';
import { inject, injectable } from 'inversify';
import {
  StartRepository,
  StartRepositoryType,
} from '../repositories/start.repository';
import { appealSceneName } from '../scenes/appeal.scenes';
import {
  AppealRepository,
  AppealRepositoryType,
} from '../repositories/appeal.repository';
import { buttonsReply } from '../keybords/keybords';

@injectable()
export class AppealCommand extends Command {
  constructor(
    @inject(Symbol.for('bot'))
    public readonly bot: Telegraf<IBotContext>,
    @inject(StartRepositoryType)
    private readonly startRepository: StartRepository,
    @inject(AppealRepositoryType)
    private readonly appealRepository: AppealRepository
  ) {
    super(bot);
  }

  handle(): void {
    this.bot.hears(['🖋 Murojaat qilish'], async (ctx) => {
      await ctx.scene.enter(appealSceneName);
    });
    this.bot.hears(['📑 Murojaatlar'], async (ctx) => {
      if (!(ctx.session.role == RoleEnum.INSPECTOR)) return;
      const appeals = await this.appealRepository.getAppeals();
      for (const item of appeals) {
        await ctx.reply(item.text, {
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: buttonsReply },
        });
      }
    });
  }
}
