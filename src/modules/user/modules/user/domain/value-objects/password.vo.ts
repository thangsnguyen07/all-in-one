import { ArgumentInvalidException } from '@shared/exceptions'
import * as bcrypt from 'bcrypt'
import { ArgumentInvalidException } from 'core'

export class Password {
  private static readonly PASSWORD_REGEX = /(?=^.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)(?=.*\d)/

  private constructor(private readonly value: string) {}

  getHashedValue(): string {
    return this.value
  }

  static async create(plainPassword: string): Promise<Password> {
    if (!Password.validate(plainPassword)) {
      throw new ArgumentInvalidException(
        'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      )
    }
    const hashedPassword = await Password.hash(plainPassword)
    return new Password(hashedPassword)
  }

  private static validate(plainPassword: string): boolean {
    return this.PASSWORD_REGEX.test(plainPassword)
  }

  private static async hash(plainPassword: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(plainPassword, saltRounds)
  }

  static createFromHash(hashedPassword: string): Password {
    return new Password(hashedPassword)
  }

  async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.value)
  }
}
