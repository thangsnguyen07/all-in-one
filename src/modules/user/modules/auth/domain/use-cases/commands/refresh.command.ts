import { Command, CommandProps } from 'core'

export class RefreshCommand extends Command {
  readonly refreshToken: string

  constructor(props: CommandProps<RefreshCommand>) {
    super(props)

    this.refreshToken = props.refreshToken
  }
}
