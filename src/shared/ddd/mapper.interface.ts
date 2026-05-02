import { BaseModel } from './model.base'

export interface Mapper<DomainModel extends BaseModel<unknown>, Entity, Response = unknown> {
  toPersistence(entity: DomainModel): Entity
  toDomain(record: Entity): DomainModel
  toResponse(entity: DomainModel): Response
}
