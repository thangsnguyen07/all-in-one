import { Inject, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ValidateUserCommand } from '../../domain/use-cases/commands/validate-user.command'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { InjectionToken } from '../injection-token'

export class ValidateUserResponse {
  id!: string
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler implements ICommandHandler<
  ValidateUserCommand,
  ValidateUserResponse
> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}

  async execute(command: ValidateUserCommand): Promise<ValidateUserResponse> {
    const { username, password } = command

    const user = await this.repository.findOneByUsername(username)

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    const isMatch = await user.getProps().password.compare(password)

    if (!isMatch) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    return { id: user.id }
  }
}
