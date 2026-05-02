import { DomainEvent, DomainEventProps } from 'core'

import { Email } from '../../value-objects/email.vo'

export class UserCreatedDomainEvent extends DomainEvent {
  readonly userId: string
  readonly email: Email

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props)
    this.userId = props.userId
    this.email = props.email
  }
}
