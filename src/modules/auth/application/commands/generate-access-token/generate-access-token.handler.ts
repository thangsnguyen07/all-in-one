import { Inject, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UserTokenRepositoryPort } from '../../../domain/user-token.repository.port'
import { AuthService } from '../../auth.service'
import { InjectionToken } from '../../injection-token'
import { GenerateAccessTokenCommand } from './generate-access-token.command'

export class GenerateAccessTokenResponse {
  accessToken!: string
}

@CommandHandler(GenerateAccessTokenCommand)
export class GenerateAccessTokenHandler implements ICommandHandler<
  GenerateAccessTokenCommand,
  GenerateAccessTokenResponse
> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
    @Inject(InjectionToken.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  async execute(command: GenerateAccessTokenCommand): Promise<GenerateAccessTokenResponse> {
    const { userId } = command

    const userToken = await this.userTokenRepository.findOneByUserId(userId)

    if (!userToken) {
      throw new UnauthorizedException('User token not found')
    }

    const token = await this.authService.generateToken(userToken.getProps().userId)

    // Optionally you update the refresh token here but standard JWT refresh implies sending both
    userToken.update({ refreshToken: token.refreshToken })
    await this.userTokenRepository.save(userToken)

    return {
      accessToken: token.accessToken,
    }
  }
}
