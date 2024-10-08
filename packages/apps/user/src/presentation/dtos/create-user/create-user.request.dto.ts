import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
