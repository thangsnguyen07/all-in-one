import { Injectable } from '@nestjs/common'
import { ICommand, IEvent, Saga, ofType } from '@nestjs/cqrs'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { UserLoggedInEvent } from '../../domain/events/user-login.event'
import { UserRegisteredEvent } from '../../domain/events/user-register.event'
import { CreateUserTokenCommand } from '../commands/create-user-token/create-user-token.command'
import { UpdateUserTokenCommand } from '../commands/update-user-token/update-user-token.command'

@Injectable()
export class AuthSaga {
  @Saga()
  userRegistered = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegisteredEvent),
      map(
        (event: UserRegisteredEvent) =>
          new CreateUserTokenCommand({
            userId: event.userId,
            refreshToken: event.refreshToken,
          }),
      ),
    )
  }

  @Saga()
  userLoggedIn = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserLoggedInEvent),
      map(
        (event: UserLoggedInEvent) =>
          new UpdateUserTokenCommand({
            userId: event.userId,
            refreshToken: event.refreshToken,
          }),
      ),
    )
  }
}
