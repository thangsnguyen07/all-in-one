import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UserTokenRepositoryPort } from '../../../domain/user-token.repository.port'
import { InjectionToken } from '../../injection-token'
import { UpdateUserTokenCommand } from './update-user-token.command'

@CommandHandler(UpdateUserTokenCommand)
export class UpdateUserTokenHandler implements ICommandHandler<UpdateUserTokenCommand, void> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly repository: UserTokenRepositoryPort,
  ) {}

  async execute(command: UpdateUserTokenCommand): Promise<void> {
    const { userId, refreshToken } = command

    const userToken = await this.repository.findOneByUserId(userId)

    if (userToken) {
      userToken.update({ refreshToken })
      await this.repository.save(userToken)
    }
  }
}
