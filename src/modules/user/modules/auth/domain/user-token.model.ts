import { AggregateID, AggregateRoot } from '@shared/ddd'
import { randomUUID } from 'crypto'

import { UserTokenProps } from './user-token.type'

export class UserToken extends AggregateRoot<UserTokenProps> {
  protected _id!: AggregateID

  get id(): AggregateID {
    return this._id
  }

  static create(payload: UserTokenProps): UserToken {
    const id = randomUUID()

    const userToken = new UserToken({ id, props: payload })

    return userToken
  }

  update(payload: Partial<UserTokenProps>): void {
    if (payload.refreshToken !== undefined) {
      this.props.refreshToken = payload.refreshToken
    }

    if (payload.revokedAt) {
      this.props.revokedAt = payload.revokedAt
    }
  }

  validate(): void {
    // entity business rules validation to protect its invariant before saving entity to a database
  }
}
