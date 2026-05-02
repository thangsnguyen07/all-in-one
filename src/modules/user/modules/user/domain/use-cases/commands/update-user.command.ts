import { Command, CommandProps } from 'core'

import { UserProps } from '../../user.type'

export class UpdateUserCommand extends Command {
  readonly userId: string
  readonly payload: Partial<UserProps>

  constructor(props: CommandProps<UpdateUserCommand>) {
    super(props)

    this.userId = props.userId
    this.payload = props.payload
  }
}
