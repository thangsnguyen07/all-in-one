import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtUser } from '../interfaces/jwt-user.interface'

export type RefreshTokenPayload = JwtUser & { refreshToken: string }

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('jwt.refreshSecret')
    if (!secret) throw new UnauthorizedException('Missing refresh token secret')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtUser): Promise<RefreshTokenPayload> {
    const authHeader = req.get('Authorization')
    const refreshToken = authHeader ? authHeader.replace('Bearer', '').trim() : ''
    return { ...payload, refreshToken }
  }
}
