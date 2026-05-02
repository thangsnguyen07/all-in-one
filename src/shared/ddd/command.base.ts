import { randomUUID } from 'crypto'

import { ArgumentNotProvidedException } from '../exceptions'
import { Helper } from '../utils/helper'

// Ensure we don't use 'any', provide explicit constraints
export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & {
  id?: string
  metadata?: Partial<CommandMetadata>
}

export type CommandMetadata = {
  readonly correlationId: string
  readonly causationId?: string
  readonly userId?: string
  readonly timestamp?: number
}

export class Command {
  readonly id: string
  readonly metadata: CommandMetadata

  constructor(props: CommandProps<unknown>) {
    if (Helper.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Command props should not be empty')
    }

    this.id = props.id || randomUUID()
    this.metadata = {
      correlationId: props.metadata?.correlationId || randomUUID(),
      causationId: props.metadata?.causationId,
      timestamp: props.metadata?.timestamp || Date.now(),
      userId: props.metadata?.userId,
    }
  }
}
