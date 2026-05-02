import { CreateUserHandler } from './create-user.handler'
import { UpdateUserPasswordHandler } from './update-password.handler'
import { UpdateUserHandler } from './update-user.handler'
import { ValidateUserHandler } from './validate-user.handler'

export const commandHandlers = [
  CreateUserHandler,
  UpdateUserPasswordHandler,
  ValidateUserHandler,
  UpdateUserHandler,
]
