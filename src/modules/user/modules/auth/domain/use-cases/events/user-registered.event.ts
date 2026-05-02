import { DomainEvent, DomainEventProps } from 'core'

export class UserRegisteredEvent extends DomainEvent {
  static readonly eventName = 'user.register'

  readonly userId: string
  readonly refreshToken: string

  constructor(props: DomainEventProps<UserRegisteredEvent>) {
    super({
      aggregateId: props.userId,
    })

    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
