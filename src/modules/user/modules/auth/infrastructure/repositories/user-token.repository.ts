import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from 'core'
import { Equal, Repository } from 'typeorm'

import { InjectionToken } from '../../application/injection-token'
import { UserToken } from '../../domain/user-token.model'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { UserTokenEntity } from '../entities/user-token.entity'
import { UserTokenMapper } from '../mappers/user-token.mapper'

@Injectable()
export class UserTokenRepository implements UserTokenRepositoryPort {
  constructor(
    @InjectRepository(UserTokenEntity) private readonly userRepository: Repository<UserTokenEntity>,
    @Inject(InjectionToken.USER_TOKEN_MAPPER) private mapper: UserTokenMapper,
  ) {}

  async findOneByUserId(userId: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ userId: Equal(userId) })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async findOneByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ refreshToken: Equal(refreshToken) })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async findOneById(id: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ id: Equal(id) })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } })
    return count > 0
  }

  async findAll(): Promise<UserToken[]> {
    const entities = await this.userRepository.find()
    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async save(model: UserToken | UserToken[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]
    const entities = models.map((model) => this.mapper.toPersistence(model))
    await this.userRepository.save(entities)
  }

  async delete(model: UserToken): Promise<boolean> {
    const result = await this.userRepository.delete(model.id)
    return result.affected !== undefined && result.affected > 0
  }

  async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<UserToken>> {
    const [entities, total] = await this.userRepository.findAndCount({
      skip: params.offset,
      take: params.limit,
      order: { createdAt: 'ASC' },
    })
    return {
      data: entities.map((entity) => this.mapper.toDomain(entity)),
      count: total,
      page: params.page,
      limit: params.limit,
    }
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return await this.userRepository.manager.transaction(async () => handler())
  }
}
