import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccessTokenStrategy } from '@shared/strategies/access-token.strategy'
import { RefreshTokenStrategy } from '@shared/strategies/refresh-token.strategy'

import { AuthService } from './application/auth.service'
import { COMMAND_HANDLERS } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { AuthSaga } from './application/sagas/auth.saga'

import { UserTokenEntity } from './infrastructure/entities/user-token.entity'
import { UserTokenMapper } from './infrastructure/mappers/user-token.mapper'
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository'

import { AuthController } from './presentation/auth.controller'

import { UserModule } from '../user/user.module'

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_TOKEN_REPOSITORY,
    useClass: UserTokenRepository,
  },
  {
    provide: InjectionToken.USER_TOKEN_MAPPER,
    useClass: UserTokenMapper,
  },
]

const application = [
  ...COMMAND_HANDLERS,
  AuthSaga,
  {
    provide: InjectionToken.AUTH_SERVICE,
    useClass: AuthService,
  },
]

const strategies = [AccessTokenStrategy, RefreshTokenStrategy]

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserTokenEntity]),
    UserModule, // Allows access to User commands via CommandBus
  ],
  controllers: [AuthController],
  providers: [...infrastructure, ...application, ...strategies],
})
export class AuthModule {}
