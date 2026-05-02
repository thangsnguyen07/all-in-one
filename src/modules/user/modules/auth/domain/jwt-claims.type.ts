import { JwtPayload } from 'jsonwebtoken'

export type JwtClaims = JwtPayload & {
  userId: string
}
