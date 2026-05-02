<<<<<<<< Updated upstream:src/modules/user/modules/user/infrastructure/mappers/user.mapper.ts
import { User } from '@/modules/user/domain/user.model'
import { Email } from '@/modules/user/domain/value-objects/email.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { Mapper } from 'core'
import { User as UserDto } from 'proto'

========
import { Mapper } from '@shared/ddd'

import { User } from '../../domain/user.model'
import { Email } from '../../domain/value-objects/email.vo'
import { Password } from '../../domain/value-objects/password.vo'
>>>>>>>> Stashed changes:src/modules/user/infrastructure/mappers/user.mapper.ts
import { UserEntity } from '../entities/user.entity'

export class UserMapper implements Mapper<User, UserEntity> {
  toPersistence(model: User): UserEntity {
    const { id, createdAt, updatedAt, deletedAt } = model

    return {
      id,
<<<<<<<< Updated upstream:src/modules/user/modules/user/infrastructure/mappers/user.mapper.ts
      email: model.getProps().email?.value,
      username: '',
========
      email: model.getProps().email?.value as string,
      username: model.getProps().username,
>>>>>>>> Stashed changes:src/modules/user/infrastructure/mappers/user.mapper.ts
      password: model.getProps().password.getHashedValue(),
      createdAt,
      updatedAt,
      deletedAt,
      isActive: model.getProps().isActive as boolean,
      isVerified: model.getProps().isVerified as boolean,
    }
  }

  toDomain(entity: UserEntity): User {
    const { id, createdAt, updatedAt, deletedAt, ...rest } = entity

    const props = {
      ...rest,
      email: rest.email ? new Email(rest.email) : undefined,
      password: Password.createFromHash(rest.password),
    }

    return new User({ id, props, createdAt, updatedAt, deletedAt: deletedAt ?? undefined })
  }

  toResponse(model: User): unknown {
    return {
      id: model.id,
      username: '',
      email: model.getProps().email?.value,
      isActive: model.getProps().isActive,
      isVerified: model.getProps().isVerified,
    }
  }
}
