import { Inject, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'

import { InjectionToken } from '@/modules/user/application/injection-token'
import { Paginated, PaginatedQueryParams } from 'core'
import { Equal, Repository } from 'typeorm'

import { User } from '../../domain/user.model'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { UserEntity } from '../entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

@Injectable()
export class UserRepository implements UserRepositoryPort {
  private readonly logger = new Logger(UserRepository.name)

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id: Equal(id) })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ email: Equal(email) })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ username: Equal(username) })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find()
    return entities.map((entity) => this.userMapper.toDomain(entity))
  }

  async save(model: User | User[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => this.userMapper.toPersistence(model))

    await this.userRepository.save(entities)

    await Promise.all(models.map((model) => model.publishEvents(this.logger, this.eventEmitter)))
  }

  async delete(model: User): Promise<boolean> {
    const result = await this.userRepository.softDelete(model.id)

    await model.publishEvents(this.logger, this.eventEmitter)

    return result.affected !== undefined && result.affected > 0
  }

  async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<User>> {
    const [entities, total] = await this.userRepository.findAndCount({
      skip: params.offset,
      take: params.limit,
      order: {
        createdAt: 'ASC',
      },
    })
    return {
      data: entities.map((entity) => this.userMapper.toDomain(entity)),
      count: total,
      page: params.page,
      limit: params.limit,
    }
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return await this.userRepository.manager.transaction(async () => handler())
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } })
    return count > 0
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } })
    return count > 0
  }
}
