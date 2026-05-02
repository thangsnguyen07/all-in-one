import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { JwtUser } from '../interfaces/jwt-user.interface'

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as JwtUser
  return user
})
