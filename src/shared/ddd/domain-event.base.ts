import { randomUUID } from 'crypto'

import { RequestContextService } from '../application/context/app-request.context'
import { ArgumentNotProvidedException } from '../exceptions'
import { Helper } from '../utils/helper'

export interface DomainEventMetadata {
  readonly timestamp: number
  readonly correlationId: string
  readonly causationId?: string
  readonly userId?: string
}

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string
  metadata?: Partial<DomainEventMetadata>
}

export abstract class DomainEvent {
  public readonly id: string
  public readonly aggregateId: string
  public readonly metadata: DomainEventMetadata

  constructor(props: DomainEventProps<unknown>) {
    if (Helper.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Domain event props should not be empty')
    }

    this.id = randomUUID()
    this.aggregateId = props.aggregateId
    this.metadata = {
<<<<<<< Updated upstream:packages/core/src/ddd/domain-event.base.ts
      correlationId: props?.metadata?.correlationId,
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
=======
      correlationId:
        props.metadata?.correlationId || RequestContextService.getRequestId() || randomUUID(),
      causationId: props.metadata?.causationId,
      timestamp: props.metadata?.timestamp || Date.now(),
      userId: props.metadata?.userId,
>>>>>>> Stashed changes:src/shared/ddd/domain-event.base.ts
    }
  }
}
