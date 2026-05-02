import { ArgumentInvalidException } from '@shared/exceptions'

export class Email {
  private readonly _emailAddress: string

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new ArgumentInvalidException('Email is invalid')
    }
    this._emailAddress = email
  }

  get value(): string {
    return this._emailAddress
  }

  get domain(): string {
    const parts = this._emailAddress.split('@')
    return parts.length > 1 ? parts[1] : ''
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public equals(other: Email): boolean {
    return this._emailAddress === other._emailAddress
  }
}
