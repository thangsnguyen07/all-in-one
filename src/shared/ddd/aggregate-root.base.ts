import { DomainEvent } from './domain-event.base'
import { BaseModel } from './model.base'

/**
 * LoggerPort replaces the external Winston Logger from prior setups
 * so we can use Nest's built-in Logger or a custom one.
 */
export interface LoggerPort {
  debug(message: string, ...optionalParams: unknown[]): void
  log(message: string, ...optionalParams: unknown[]): void
  error(message: string, ...optionalParams: unknown[]): void
  warn(message: string, ...optionalParams: unknown[]): void
}

/**
 * EventPublisherPort to avoid dependency on EventEmitter2 in AggregateRoot,
 * since the monolith will use CQRS EventPublisher or EventBus.
 */
export interface EventPublisherPort {
  publish(event: DomainEvent): void
  publishAll(events: DomainEvent[]): void
}

export abstract class AggregateRoot<Props> extends BaseModel<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearDomainEvents(): void {
    this._domainEvents = []
  }

  public publishEvents(logger: LoggerPort, publisher: EventPublisherPort): void {
    this.domainEvents.forEach((event) => {
      logger.debug(
        `"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`,
      )
    })

    publisher.publishAll(this.domainEvents)
    this.clearDomainEvents()
  }
}
