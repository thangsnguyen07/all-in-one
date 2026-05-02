import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UserToken } from '../../../domain/user-token.model'
import { UserTokenRepositoryPort } from '../../../domain/user-token.repository.port'
import { InjectionToken } from '../../injection-token'
import { CreateUserTokenCommand } from './create-user-token.command'

@CommandHandler(CreateUserTokenCommand)
export class CreateUserTokenHandler implements ICommandHandler<CreateUserTokenCommand, void> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly repository: UserTokenRepositoryPort,
  ) {}

  async execute(command: CreateUserTokenCommand): Promise<void> {
    const { userId, refreshToken } = command

    const userToken = UserToken.create({
      userId,
      refreshToken,
    })

    await this.repository.save(userToken)
  }
}
