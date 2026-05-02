import { Command, CommandProps } from '@shared/ddd'

export class LoginCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<LoginCommand>) {
    super(props)
<<<<<<<< Updated upstream:src/modules/user/modules/auth/domain/use-cases/commands/login.command.ts

    this.email = props.email
========
    this.username = props.username
>>>>>>>> Stashed changes:src/modules/auth/application/commands/login/login.command.ts
    this.password = props.password
  }
}
