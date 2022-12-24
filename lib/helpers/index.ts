import jwt from 'jsonwebtoken'
import { User } from '../../modules/user/user.interface'
import ConfigService from '../config/config.service'

export interface ContextProps {
  headers: {
    authorization: string
  }
}

export interface ReturningIdProps {
  id: number
}

export const signJwt = (record: Record<string, any>): string => {
  return jwt.sign(record, ConfigService.jwt.secret)
}

export const decodeJwt = <T>(token: string): T => {
  return jwt.verify(token, ConfigService.jwt.secret) as T
}

export const authGuard = (token: string): User => {
  const user = decodeJwt<User>(token)
  if (user === undefined || user === null) throw new Error('Please login first')
  return user
}
