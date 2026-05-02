import { OrderBy, PaginatedQueryParams } from './repository.port'

/**
 * Base class for all queries in the system
 * Provides common functionality for query objects
 */
export abstract class QueryBase {
  /**
   * Unique identifier for the query
   */
  readonly id: string

  readonly timestamp: Date

  constructor(id?: string) {
    this.id = id || crypto.randomUUID()
    this.timestamp = new Date()
  }

  /**
   * Returns a string representation of the query
   */
  toString(): string {
    return `${this.constructor.name} [${this.id}]`
  }

  /**
   * Validates the query parameters
   * Override this method to add custom validation logic
   */
  validate(): boolean {
    return true
  }
}

/**
 * Base class for paginated queries
 * Extends QueryBase to add pagination functionality
 */

export type PaginatedParams<T> = Omit<T, 'limit' | 'offset' | 'orderBy' | 'page'> &
  Partial<Omit<PaginatedQueryParams, 'offset'>>

export abstract class PaginatedQueryBase extends QueryBase {
  /**
   * Maximum number of items per page
   */
  readonly limit: number

  /**
   * Number of items to skip
   */
  readonly offset: number

  /**
   * Current page number (0-based)
   */
  readonly page: number

  /**
   * Sorting configuration
   */
  readonly orderBy: OrderBy

  constructor(props: PaginatedParams<unknown>) {
    super()
    this.limit = props.limit || 20
    this.page = props.page || 0
    this.offset = this.page * this.limit
    this.orderBy = props.orderBy || { field: true, param: 'desc' }
  }

  /**
   * Validates pagination parameters
   */
  override validate(): boolean {
    return (
      super.validate() &&
      this.limit > 0 &&
      this.page >= 0 &&
      this.offset >= 0 &&
      this.orderBy.field !== undefined &&
      this.orderBy.param !== undefined
    )
  }
}


