import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SuccessResponseDto } from '@shared/dtos/response.dto'

import { UpdateUserPasswordCommand } from '../../domain/use-cases/commands/update-password.command'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { Password } from '../../domain/value-objects/password.vo'
import { InjectionToken } from '../injection-token'

// Create a local interface for the success payload to avoid arbitrary `any`
interface UpdatePasswordPayload {
  id: string
  username: string
}

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<
  UpdateUserPasswordCommand,
  SuccessResponseDto<UpdatePasswordPayload>
> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}

  async execute(
    command: UpdateUserPasswordCommand,
  ): Promise<SuccessResponseDto<UpdatePasswordPayload>> {
    const { userId, currentPassword, newPassword } = command

    const user = await this.repository.findOneById(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const hashedCurrentPassword = await Password.create(currentPassword)

    const isMatch = await user.getProps().password.compare(hashedCurrentPassword.getHashedValue())

    if (!isMatch) {
      throw new UnauthorizedException('Wrong password')
    }

    user.updatePassword(await Password.create(newPassword))

    await this.repository.save(user)

    return new SuccessResponseDto<UpdatePasswordPayload>(
      {
        id: user.id,
        username: user.getProps().username,
      },
      200,
      'Password updated successfully',
    )
  }
}
