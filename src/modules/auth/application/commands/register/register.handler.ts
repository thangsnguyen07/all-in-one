import { Inject } from '@nestjs/common'
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'

// Import the user command to dispatch
import { CreateUserCommand } from '../../../../user/domain/use-cases/commands/create-user.command'
import { UserRegisteredEvent } from '../../../domain/events/user-register.event'
import { AuthService, Token } from '../../auth.service'
import { InjectionToken } from '../../injection-token'
import { RegisterCommand } from './register.command'

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, Token | void> {
  constructor(
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterCommand): Promise<Token | void> {
    const { username, email, password } = command

    // Call User module internally via CQRS instead of gRPC
    const user = await this.commandBus.execute(new CreateUserCommand({ username, email, password }))

    if (!user?.id) {
      return
    }

    const token = await this.authService.generateToken(user.id)

    // Saga will catch this event
    this.eventBus.publish(
      new UserRegisteredEvent({
        userId: user.id,
        refreshToken: token.refreshToken,
      }),
    )

    return token
  }
}
