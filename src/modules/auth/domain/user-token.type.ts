export interface UserTokenProps {
  userId: string
  refreshToken: string | null
  revokedAt?: Date
}
