import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { SuccessResponseDto } from '@shared/dtos/response.dto'
import { AccessTokenGuard } from '@shared/guards/access-token.guard'
import { RefreshTokenGuard } from '@shared/guards/refresh-token.guard'
import { JwtUser } from '@shared/interfaces/jwt-user.interface'

import { GenerateAccessTokenCommand } from '../application/commands/generate-access-token/generate-access-token.command'
import { LoginCommand } from '../application/commands/login/login.command'
import { LogoutCommand } from '../application/commands/logout/logout.command'
import { RegisterCommand } from '../application/commands/register/register.command'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<SuccessResponseDto<any>> {
    const command = new RegisterCommand(body)
    const result = await this.commandBus.execute(command)
    return new SuccessResponseDto(result)
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<SuccessResponseDto<any>> {
    const command = new LoginCommand(body)
    const result = await this.commandBus.execute(command)
    return new SuccessResponseDto(result)
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@CurrentUser() user: JwtUser): Promise<SuccessResponseDto<any>> {
    const command = new GenerateAccessTokenCommand({ userId: user.sub as string })
    const result = await this.commandBus.execute(command)
    return new SuccessResponseDto(result)
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@CurrentUser() user: JwtUser): Promise<SuccessResponseDto<any>> {
    const command = new LogoutCommand({ userId: user.sub as string })
    await this.commandBus.execute(command)
    return new SuccessResponseDto({ success: true })
  }
}
