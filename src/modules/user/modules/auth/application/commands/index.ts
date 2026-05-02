import { GenerateAccessTokenHandler } from './generate-access-token.handler'
import { LoginCommandHandler } from './login.handler'
import { LogoutCommandHandler } from './logout.handler'
import { RefreshCommandHandler } from './refresh.handler'
import { RegisterCommandHandler } from './register.handler'

export const commandHandlers = [
  GenerateAccessTokenHandler,
  LoginCommandHandler,
  RegisterCommandHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
]
