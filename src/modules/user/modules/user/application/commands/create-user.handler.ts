import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateUserCommand } from '@/modules/user/domain/use-cases/commands/create-user.command'
import { User } from '@/modules/user/domain/user.model'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { Email } from '@/modules/user/domain/value-objects/email.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper'
import { ConflictException } from 'core'
import { User as CreateUserResponse } from 'proto'

import { InjectionToken } from '../injection-token'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, CreateUserResponse> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const { email, password } = command

    const user = await this.repository.findOneByEmail(email)

    if (user) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await Password.create(password)

    const newUser = User.create({
      email: new Email(email),
      password: hashedPassword,
    })
    await this.repository.save(newUser)

    return this.userMapper.toResponse(newUser)
  }
}
