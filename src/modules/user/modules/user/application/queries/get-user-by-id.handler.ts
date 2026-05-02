import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
<<<<<<<< Updated upstream:src/modules/user/modules/user/application/queries/get-user-by-id.handler.ts
import { RpcException } from '@nestjs/microservices'

import { GetUserByIdQuery } from '@/modules/user/domain/use-cases/queries/get-user-by-id.query'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { status } from '@grpc/grpc-js'
import { User as GetUserByIdResponse } from 'proto'

========

import { GetUserByIdQuery } from '../../domain/use-cases/queries/get-user-by-id.query'
import { UserRepositoryPort } from '../../domain/user.repository.port'
>>>>>>>> Stashed changes:src/modules/user/application/queries/get-user-by-id.handler.ts
import { InjectionToken } from '../injection-token'

export class GetUserByIdResponse {
  id!: string
  username!: string
  email!: string
  isActive?: boolean
  isVerified?: boolean
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<
  GetUserByIdQuery,
  GetUserByIdResponse
> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResponse> {
    const { id } = query

    const user = await this.repository.findOneById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      id: user.id,
<<<<<<<< Updated upstream:src/modules/user/modules/user/application/queries/get-user-by-id.handler.ts
      username: '',
      email: user.getProps().email.value,
========
      username: user.getProps().username,
      email: user.getProps().email?.value as string,
>>>>>>>> Stashed changes:src/modules/user/application/queries/get-user-by-id.handler.ts
      isActive: user.getProps().isActive,
      isVerified: user.getProps().isVerified,
    }
  }
}
