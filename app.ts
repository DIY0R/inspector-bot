import 'reflect-metadata';
import { Telegraf } from 'telegraf';
import { IConfigService } from './src/config/config.interface';
import { ConfigService } from './src/config/config.service';
import { IBotContext } from './src/context/context.interface';
import { Command } from './src/commands/command.class';
import LocalSession from 'telegraf-session-local';
import { AppDataSource } from './src/db/connect';
import { commands } from './src/keybords/keybords';
import { TypeCommands, myContainer } from './Inversify.settings';
import { DataSource } from 'typeorm';
import { InversifyRepositoryScenes } from './src/scenes/index.inversify';
import { Scenes } from './src/scenes/scenes.class';
import { Stage } from 'telegraf/scenes';

class Bot {
  stage: Stage<any, any>;
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.getKey('TOKEN'));
    this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
    this.stage = new Stage();
    this.bot.use(this.stage.middleware());
  }
  async init() {
    try {
      const databaseStore = await AppDataSource.initialize();
      myContainer
        .bind<Telegraf<IBotContext>>(Symbol.for('bot'))

        .toConstantValue(this.bot);
      myContainer
        .bind<DataSource>(Symbol.for('dataBase'))
        .toConstantValue(databaseStore);

      TypeCommands.forEach((sym) => myContainer.get<Command>(sym).handle());

      this.bot.telegram.setMyCommands(commands);

      InversifyRepositoryScenes.forEach(({ key }) =>
        this.stage.register(myContainer.get<Scenes>(key).scene())
      );

      this.bot.launch();
      console.info('BOT LUNCHED!');
    } catch (error) {
      console.error(error);
    }
  }
}
const bot = new Bot(new ConfigService());
bot.init();
