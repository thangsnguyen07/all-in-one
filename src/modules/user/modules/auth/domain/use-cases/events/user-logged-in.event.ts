import { DomainEvent, DomainEventProps } from 'core'

export class UserLoggedInEvent extends DomainEvent {
  static readonly eventName = 'user.login'

  readonly userId: string
  readonly refreshToken: string

  constructor(props: DomainEventProps<UserLoggedInEvent>) {
    super(props)

    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
