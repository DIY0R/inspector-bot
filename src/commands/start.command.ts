import { Telegraf } from 'telegraf';
import { IBotContext, LanEnum, RoleEnum } from '../context/context.interface';
import { Command } from './command.class';
import { keyBoards } from '../keybords/keybords';
import { inject, injectable } from 'inversify';
import {
  StartRepository,
  StartRepositoryType,
} from '../repositories/start.repository';
import { addPasswordScene } from '../scenes/addPassport.scenes';

@injectable()
export class StartCommand extends Command {
  constructor(
    @inject(Symbol.for('bot'))
    public readonly bot: Telegraf<IBotContext>,
    @inject(StartRepositoryType)
    private readonly startRepository: StartRepository
  ) {
    super(bot);
  }

  private async start(ctx: any) {
    return ctx.reply(
      'Menu',
      keyBoards.getKeyBoard(ctx.session.lan, ctx.session.role)
    );
  }
  private async startCheckPhone() {
    this.bot.on('contact', async (ctx, next) => {
      const phone = ctx.message.contact.phone_number;
      const addPhone = await this.startRepository.addPhone(ctx.chat.id, phone);
      ctx.reply(addPhone);
      next();
    });
  }
  handle(): void {
    this.startCheckPhone();
    this.bot.use(async (ctx, next) => {
      const chatId = ctx.chat?.id as number;
      ctx.session.role = RoleEnum.STUDENT;
      ctx.session.lan = LanEnum.UZB;
      const isAdmin = await this.startRepository.checkRole(
        chatId,
        RoleEnum.INSPECTOR
      );
      if (isAdmin) ctx.session.role = RoleEnum.INSPECTOR;
      next();
    });
    this.bot.use(async (ctx, next) => {
      if (ctx.session.role == RoleEnum.INSPECTOR) return next();
      const chatId = ctx.chat?.id as number;

      const phoneCheck = await this.startRepository.checkPhone(chatId);
      if (phoneCheck) return next();
      ctx.reply(
        'Iltimos, kontaktingizni bosish orqali kontaktingizni yuboring',
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: '📲 Telefon raqamingizni yuboring!',
                  request_contact: true,
                },
              ],
            ],
            one_time_keyboard: true,
          },
        }
      );
    });
    this.bot.use(async (ctx, next) => {
      const chatId = ctx.chat?.id as number;
      const isAddPassport = await this.startRepository.checkPasportId(chatId);
      if (ctx.session.role == RoleEnum.INSPECTOR || isAddPassport)
        return next();
      ctx.scene.enter(addPasswordScene);
    });
    this.bot.start(async (ctx) => {
      this.start(ctx);
    });
  }
}
