import { Command, CommandProps } from '@shared/ddd'

export class UpdateUserTokenCommand extends Command {
  readonly userId: string
  readonly refreshToken: string

  constructor(props: CommandProps<UpdateUserTokenCommand>) {
    super(props)
    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
