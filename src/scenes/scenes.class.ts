import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';

import { BaseScene } from 'telegraf/typings/scenes';

export abstract class Scenes {
  constructor(public bot: Telegraf<IBotContext>) {}
  abstract scene(): BaseScene<IBotContext>;
}
