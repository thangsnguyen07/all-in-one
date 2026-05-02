import { IQuery } from '@nestjs/cqrs'

export class GetUserByIdQuery implements IQuery {
  readonly id: string

  constructor(props: GetUserByIdQuery) {
    this.id = props.id
  }
}
