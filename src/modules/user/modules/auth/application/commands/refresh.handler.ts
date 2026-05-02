import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RefreshResponse } from 'proto'

import { RefreshCommand } from '../../domain/use-cases/commands/refresh.command'
import { AuthService } from '../auth.service'
import { InjectionToken } from '../injection-token'

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand, RefreshResponse> {
  constructor(@Inject(InjectionToken.AUTH_SERVICE) private authService: AuthService) {}

  async execute(command: RefreshCommand): Promise<any> {
    try {
      const { refreshToken } = command

      const claims = await this.authService.verifyRefreshToken(refreshToken)

      const accessToken = await this.authService.generateAccessToken(claims.userId)

      return { accessToken }
    } catch (error) {
      throw error
    }
  }
}
