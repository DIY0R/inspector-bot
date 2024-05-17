import 'reflect-metadata';
import { Container } from 'inversify';
import { GetIdCommand } from './src/commands/options.class';
import { Command } from './src/commands/command.class';
import { StartCommand } from './src/commands/start.command';
import { InversifyRepository } from './src/repositories/index.inversify';
import { InversifyRepositoryScenes } from './src/scenes/index.inversify';
import { AppealCommand } from './src/commands/appeal.command';

const CommandType = Symbol.for('GetIdCommand');
const StartType = Symbol.for('StartType');
const AppealCommandType = Symbol.for('AppealCommand');

export const TypeCommands = [CommandType, StartType, AppealCommandType];
const myContainer = new Container({ skipBaseClassChecks: true });

myContainer.bind<Command>(CommandType).to(GetIdCommand);
myContainer.bind<Command>(StartType).to(StartCommand);
myContainer.bind<Command>(AppealCommandType).to(AppealCommand);

[...InversifyRepository, ...InversifyRepositoryScenes].forEach(
  ({ key, repository }) => {
    myContainer.bind<typeof repository>(key).to(repository as any);
  }
);

export { myContainer };
