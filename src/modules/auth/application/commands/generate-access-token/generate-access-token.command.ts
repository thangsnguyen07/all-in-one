import { Command, CommandProps } from '@shared/ddd'

export class GenerateAccessTokenCommand extends Command {
  readonly userId: string

  constructor(props: CommandProps<GenerateAccessTokenCommand>) {
    super(props)
    this.userId = props.userId
  }
}
