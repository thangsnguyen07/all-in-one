import { status as grpcStatus } from '@grpc/grpc-js'

import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../exceptions'

export interface ExceptionStatusMapping {
  code: string
  status: grpcStatus
}

export class ExceptionStatusMapper {
  private static readonly mappings: ExceptionStatusMapping[] = [
    {
      code: ARGUMENT_INVALID,
      status: grpcStatus.INVALID_ARGUMENT,
    },
    {
      code: ARGUMENT_NOT_PROVIDED,
      status: grpcStatus.INVALID_ARGUMENT,
    },
    {
      code: ARGUMENT_OUT_OF_RANGE,
      status: grpcStatus.OUT_OF_RANGE,
    },
    {
      code: CONFLICT,
      status: grpcStatus.ALREADY_EXISTS,
    },
    {
      code: NOT_FOUND,
      status: grpcStatus.NOT_FOUND,
    },
    {
      code: INTERNAL_SERVER_ERROR,
      status: grpcStatus.INTERNAL,
    },
  ]

  static fromExceptionCodeToGrpcStatus(exceptionCode: string): grpcStatus {
    if (exceptionCode) {
      const mapping = this.mappings.find(
        ({ code }) => code === exceptionCode,
      )

      if (mapping) {
        return mapping.status
      }
    }

    return grpcStatus.INTERNAL
  }

  static getMappings(): ExceptionStatusMapping[] {
    return [...this.mappings]
  }
}
