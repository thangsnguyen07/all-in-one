import { AggregateID, AggregateRoot } from '@libs/core'

import { randomUUID } from 'crypto'

import { UserEntity } from '../infrastructure/entities/user.entity'
import { UserProps } from './user.type'

export class User extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID

  static create(payload: UserProps): User {
    const id = randomUUID()

    const user = new User({ id, props: payload })

    return user
  }

  static loadFromEntity(entity: UserEntity): User {
    const { id, createdAt, updatedAt, deletedAt, version, ...props } = entity

    return new User({ id, props, createdAt, updatedAt, deletedAt, version })
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
