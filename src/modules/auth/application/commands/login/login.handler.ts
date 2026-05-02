import { Inject } from '@nestjs/common'
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'

// Import the user command to dispatch
import { ValidateUserCommand } from '../../../../user/domain/use-cases/commands/validate-user.command'
import { UserLoggedInEvent } from '../../../domain/events/user-login.event'
import { AuthService, Token } from '../../auth.service'
import { InjectionToken } from '../../injection-token'
import { LoginCommand } from './login.command'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, Token | void> {
  constructor(
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginCommand): Promise<Token | void> {
    const { username, password } = command

    // Call User module internally via CQRS
    const user = await this.commandBus.execute(new ValidateUserCommand({ username, password }))

    if (!user?.id) {
      return
    }

    const token = await this.authService.generateToken(user.id)

    // Publish to CQRS EventBus instead of EventEmitter
    this.eventBus.publish(
      new UserLoggedInEvent({
        userId: user.id,
        refreshToken: token.refreshToken,
      }),
    )

    return token
  }
}
