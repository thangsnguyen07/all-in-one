import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { UserEntity } from './infrastructure/entities/user.entity'
import { UserMapper } from './infrastructure/mappers/user.mapper'
import { UserRepository } from './infrastructure/repositories/user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: InjectionToken.USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: InjectionToken.USER_MAPPER,
      useClass: UserMapper,
    },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class UserModule {}
