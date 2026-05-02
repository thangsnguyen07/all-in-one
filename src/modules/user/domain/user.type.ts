import { Email } from './value-objects/email.vo'
import { Password } from './value-objects/password.vo'

export interface UserProps {
  email: Email
  password: Password
  isActive?: boolean
  isVerified?: boolean
}
