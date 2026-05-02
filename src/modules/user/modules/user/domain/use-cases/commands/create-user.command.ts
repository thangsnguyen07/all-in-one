import { Command, CommandProps } from '@shared/ddd'

export class CreateUserCommand extends Command {
  // readonly username: string
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props)
<<<<<<<< Updated upstream:src/modules/user/modules/user/domain/use-cases/commands/create-user.command.ts

    // this.username = props.username
========
    this.username = props.username
>>>>>>>> Stashed changes:src/modules/user/domain/use-cases/commands/create-user.command.ts
    this.email = props.email
    this.password = props.password
  }
}
