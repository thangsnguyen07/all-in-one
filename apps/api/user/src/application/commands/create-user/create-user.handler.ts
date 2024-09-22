import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import * as bcrypt from 'bcrypt'
import { User as CreateUserResponse } from 'proto'
import { User } from 'src/domain/user.model'
import { UserRepositoryPort } from 'src/domain/user.repository.port'

import { InjectionToken } from '../../injection-token'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, CreateUserResponse> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const { username, password } = command

    const isUserExist = await this.repository.findOneByUsername(username)

    if (isUserExist) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this username already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = User.create({ username, password: hashedPassword })
    await this.repository.save(user)

    return {
      id: user.id,
      username: user.getProps().username,
      email: user.getProps().email,
    }
  }
}
