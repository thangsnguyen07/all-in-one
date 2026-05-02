import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateUserPasswordCommand } from '@/modules/user/domain/use-cases/commands/update-password.command'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper'
import { ArgumentInvalidException, NotFoundException } from 'core'

import { InjectionToken } from '../injection-token'

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}
  async execute(command: UpdateUserPasswordCommand): Promise<any> {
    const { userId, currentPassword, newPassword } = command

    const user = await this.repository.findOneById(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isMatch = await user.getProps().password.compare(currentPassword)

    if (!isMatch) {
      throw new ArgumentInvalidException('Wrong password')
    }

    user.updatePassword(await Password.create(newPassword))

    this.repository.save(user)

    return this.userMapper.toResponse(user)
  }
}
