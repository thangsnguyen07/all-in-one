import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthService } from './application/auth.service'
import { commandHandlers } from './application/commands'
import { eventHandlers } from './application/events'
import { InjectionToken } from './application/injection-token'

import { UserTokenEntity } from './infrastructure/entities/user-token.entity'
import { UserTokenMapper } from './infrastructure/mappers/user-token.mapper'
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserTokenEntity]),
  ],
  providers: [
    {
      provide: InjectionToken.USER_TOKEN_REPOSITORY,
      useClass: UserTokenRepository,
    },
    {
      provide: InjectionToken.USER_TOKEN_MAPPER,
      useClass: UserTokenMapper,
    },
    {
      provide: InjectionToken.AUTH_SERVICE,
      useClass: AuthService,
    },
    ...commandHandlers,
    ...eventHandlers,
    JwtModule,
  ],
})
export class AuthModule {}
