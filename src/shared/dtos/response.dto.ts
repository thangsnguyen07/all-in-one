import { HttpStatus } from '@nestjs/common'

export class SuccessResponseDto<T> {
  success: boolean
  statusCode: number
  message: string
  data: T

  constructor(data: T, statusCode: number = HttpStatus.OK, message: string = 'Success') {
    this.success = true
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
}

export class ErrorResponseDto {
  success: boolean
  statusCode: number
  message: string
  error: string

  constructor(
    message: string = 'Bad Request',
    statusCode: number = HttpStatus.BAD_REQUEST,
    error: string = 'BAD_REQUEST',
  ) {
    this.success = false
    this.statusCode = statusCode
    this.message = message
    this.error = error
  }
}
