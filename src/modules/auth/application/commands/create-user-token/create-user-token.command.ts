import { Command, CommandProps } from '@shared/ddd'

export class CreateUserTokenCommand extends Command {
  readonly userId: string
  readonly refreshToken: string

  constructor(props: CommandProps<CreateUserTokenCommand>) {
    super(props)
    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
