import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './command.class';
import { inject, injectable } from 'inversify';

@injectable()
export class GetIdCommand extends Command {
  constructor(
    @inject(Symbol.for('bot')) public readonly botInject: Telegraf<IBotContext>
  ) {
    super(botInject);
  }
  handle(): void {
    this.botInject.command('id', (ctx) => {
      ctx.sendMessage(ctx.chat.id.toString());
    });
    this.botInject.hears(`📑 Ma'lumot`, async (ctx) => {
      const channelId = '-1002064715281';
      const messageId = 6;
      await ctx.telegram.forwardMessage(ctx.chat.id, channelId, messageId);
    });
  }
}
