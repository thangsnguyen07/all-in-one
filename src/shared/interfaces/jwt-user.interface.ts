import { JwtPayload } from 'jsonwebtoken'

export interface JwtUser extends JwtPayload {
    userId: string
}
