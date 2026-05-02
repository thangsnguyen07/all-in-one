import { Inject } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CreateUserCommand } from '@/modules/user/domain/use-cases/commands/create-user.command'
import { Token } from 'proto'

import { RegisterCommand } from '../../domain/use-cases/commands/register.command'
import { UserRegisteredEvent } from '../../domain/use-cases/events/user-registered.event'
import { AuthService } from '../auth.service'
import { InjectionToken } from '../injection-token'

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, Token> {
  constructor(
    @Inject(InjectionToken.AUTH_SERVICE) private authService: AuthService,
    private commandBus: CommandBus,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    try {
      const { email, password } = command

      const user = await this.commandBus.execute(
        new CreateUserCommand({
          email,
          password,
        }),
      )

      const token = await this.authService.generateToken(user.id)

      this.eventEmitter.emit(
        UserRegisteredEvent.eventName,
        new UserRegisteredEvent({
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
