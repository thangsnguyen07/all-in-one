import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from '@shared/ddd'
import { Repository } from 'typeorm'

import { InjectionToken } from '../../application/injection-token'
import { UserToken } from '../../domain/user-token.model'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { UserTokenEntity } from '../entities/user-token.entity'
import { UserTokenMapper } from '../mappers/user-token.mapper'

@Injectable()
export class UserTokenRepository implements UserTokenRepositoryPort {
  constructor(
    @InjectRepository(UserTokenEntity)
    private readonly userTokenRepository: Repository<UserTokenEntity>,
    @Inject(InjectionToken.USER_TOKEN_MAPPER)
    private readonly userTokenMapper: UserTokenMapper,
  ) {}

  async findOneByUserId(userId: string): Promise<UserToken | null> {
    const entity = await this.userTokenRepository.findOneBy({ userId })
    return entity ? this.userTokenMapper.toDomain(entity) : null
  }

  async findOneByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    const entity = await this.userTokenRepository.findOneBy({ refreshToken })
    return entity ? this.userTokenMapper.toDomain(entity) : null
  }

  async findOneById(id: string): Promise<UserToken | null> {
    const entity = await this.userTokenRepository.findOneBy({ id })
    return entity ? this.userTokenMapper.toDomain(entity) : null
  }

  async findAll(): Promise<UserToken[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: UserToken | UserToken[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => this.userTokenMapper.toPersistence(model))

    await this.userTokenRepository.save(entities)
  }

  async delete(model: UserToken): Promise<boolean> {
    const result = await this.userTokenRepository.delete(model.id)
    return !!result.affected
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<UserToken>> {
    throw new Error('Method not implemented.')
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error('Method not implemented.')
  }
}
