import { Inject, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UserTokenRepositoryPort } from '../../../domain/user-token.repository.port'
import { InjectionToken } from '../../injection-token'
import { LogoutCommand } from './logout.command'

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { userId } = command

    const userToken = await this.userTokenRepository.findOneByUserId(userId)

    if (!userToken) {
      throw new UnauthorizedException('User token not found')
    }

    userToken.update({ refreshToken: null })

    await this.userTokenRepository.save(userToken)
  }
}
