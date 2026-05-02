import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper'
import { ConflictException, NotFoundException } from 'core'
import { User } from 'proto'

import { UpdateUserCommand } from '../../domain/use-cases/commands/update-user.command'
import { InjectionToken } from '../injection-token'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}
  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, payload } = command

    const user = await this.repository.findOneById(userId)
    console.log({ user })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (payload.email && !payload.email.equals(user.getProps().email)) {
      const userWithEmail = await this.repository.existsByEmail(payload.email.value)

      if (userWithEmail) {
        throw new ConflictException('Email already in use')
      }
    }

    user.update(payload)

    await this.repository.save(user)

    return this.userMapper.toResponse(user)
  }
}
