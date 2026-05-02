import { Command, CommandProps } from '@shared/ddd'

export class RegisterCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<RegisterCommand>) {
    super(props)
<<<<<<<< Updated upstream:src/modules/user/modules/auth/domain/use-cases/commands/register.command.ts

========
    this.username = props.username
>>>>>>>> Stashed changes:src/modules/auth/application/commands/register/register.command.ts
    this.email = props.email
    this.password = props.password
  }
}
