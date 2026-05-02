import { RepositoryPort } from '@shared/ddd'

import { UserToken } from './user-token.model'

export interface UserTokenRepositoryPort extends RepositoryPort<UserToken> {
  findOneByUserId(userId: string): Promise<UserToken | null>
  findOneByRefreshToken(refreshToken: string): Promise<UserToken | null>
}
