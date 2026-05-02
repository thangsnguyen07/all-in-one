import { Mapper } from '@shared/ddd'

import { UserToken } from '../../domain/user-token.model'
import { UserTokenEntity } from '../entities/user-token.entity'

export class UserTokenMapper implements Mapper<UserToken, UserTokenEntity> {
  toPersistence(model: UserToken): UserTokenEntity {
    const { id, createdAt, updatedAt } = model

    return {
      id,
      userId: model.getProps().userId,
      refreshToken: model.getProps().refreshToken as string,
      revokedAt: model.getProps().revokedAt as Date,
      createdAt,
      updatedAt,
    }
  }

  toDomain(entity: UserTokenEntity): UserToken {
    const { id, createdAt, updatedAt, ...props } = entity

    return new UserToken({
      id,
      props,
      createdAt,
      updatedAt,
    })
  }

  toResponse(model: UserToken): unknown {
    return {
      id: model.id,
      userId: model.getProps().userId,
      refreshToken: model.getProps().refreshToken,
    }
  }
}
