import { Inject } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { ValidateUserCommand } from '@/modules/user/domain/use-cases/commands/validate-user.command'
import { Token } from 'proto'

import { LoginCommand } from '../../domain/use-cases/commands/login.command'
import { UserLoggedInEvent } from '../../domain/use-cases/events/user-logged-in.event'
import { AuthService } from '../auth.service'
import { InjectionToken } from '../injection-token'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, Token> {
  constructor(
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
    private commandBus: CommandBus,
  ) {}

  async execute(command: LoginCommand): Promise<Token> {
    try {
      const { email, password } = command

      const user = await this.commandBus.execute(
        new ValidateUserCommand({
          email,
          password,
        }),
      )

      const token = await this.authService.generateToken(user.id)

      this.eventEmitter.emit(
        UserLoggedInEvent.eventName,
        new UserLoggedInEvent({
          aggregateId: user.id,
          userId: user.id,
          refreshToken: token.refreshToken,
        }),
      )

      return token
    } catch (error) {
      throw error
    }
  }
}
