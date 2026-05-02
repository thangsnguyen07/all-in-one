import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { COMMAND_HANDLERS } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { QUERY_HANDLERS } from './application/queries'

import { UserEntity } from './infrastructure/entities/user.entity'
import { UserMapper } from './infrastructure/mappers/user.mapper'
import { UserRepository } from './infrastructure/repositories/user.repository'

import { UserController } from './presentation/user.controller'

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: InjectionToken.USER_MAPPER,
    useClass: UserMapper,
  },
]

const application = [...QUERY_HANDLERS, ...COMMAND_HANDLERS]

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [...infrastructure, ...application],
  exports: [CqrsModule], // Export CqrsModule so that AuthModule can dispatch user commands
})
export class UserModule {}
