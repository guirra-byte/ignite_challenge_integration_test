import { container, delay } from 'tsyringe';

import { IUsersRepository } from '../../modules/users/repositories/IUsersRepository';
import { UsersRepository } from '../../modules/users/repositories/UsersRepository';

import { IStatementsRepository } from '../../modules/statements/repositories/IStatementsRepository';
import { StatementsRepository } from '../../modules/statements/repositories/StatementsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository),
);

container.registerSingleton<IStatementsRepository>(
  'StatementsRepository',
  delay(() => StatementsRepository),
);
