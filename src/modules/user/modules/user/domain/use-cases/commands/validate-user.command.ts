import { Command, CommandProps } from '@shared/ddd'

export class ValidateUserCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<ValidateUserCommand>) {
    super(props)
<<<<<<<< Updated upstream:src/modules/user/modules/user/domain/use-cases/commands/validate-user.command.ts

    this.email = props.email
========
    this.username = props.username
>>>>>>>> Stashed changes:src/modules/user/domain/use-cases/commands/validate-user.command.ts
    this.password = props.password
  }
}
