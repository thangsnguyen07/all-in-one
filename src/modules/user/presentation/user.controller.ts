import { Controller, Get, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'

import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { SuccessResponseDto } from '@shared/dtos/response.dto'
import { AccessTokenGuard } from '@shared/guards/access-token.guard'
import { JwtUser } from '@shared/interfaces/jwt-user.interface'

import { GetUserByIdResponse } from '../application/queries/get-user-by-id.handler'
import { GetUserByIdQuery } from '../domain/use-cases/queries/get-user-by-id.query'

@Controller('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMe(@CurrentUser() user: JwtUser): Promise<SuccessResponseDto<GetUserByIdResponse>> {
    const query = new GetUserByIdQuery({ id: user.sub as string })
    const result = await this.queryBus.execute<GetUserByIdQuery, GetUserByIdResponse>(query)
    return new SuccessResponseDto(result)
  }
}
