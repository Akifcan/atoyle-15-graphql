import jwt from 'jsonwebtoken'
import ConfigService from '../config/config.service'

export const signJwt = (record: Record<string, any>): string => {
  return jwt.sign(record, ConfigService.jwt.secret)
}

export const decodeJwt = <T>(token: string): T => {
  return jwt.verify(token, ConfigService.jwt.secret) as T
}
