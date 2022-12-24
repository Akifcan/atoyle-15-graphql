import dotenv from 'dotenv'
import * as yup from 'yup'

class ConfigService {
  static jwt: {
    secret: string
  }

  static app: {
    port: number
    name: string
  }

  static db: {
    user: string
    password: string
    database: string
    port: number
    host: string
  }

  static initialize(): void {
    dotenv.config()
    const vars = Object.assign({}, process.env) as Record<string, any>

    const schema = yup.object().shape({
      APP_NAME: yup.string().required(),
      DATABASE_NAME: yup.string().required(),
      DATABASE_USER: yup.string().required(),
      DATABASE_PASSWORD: yup.string().required(),
      DATABASE_HOST: yup.string().required(),
      PORT: yup.number().required(),
      DATABASE_PORT: yup.number().required(),
      JWT_SECRET: yup.string().required()
    })

    schema.validateSync(vars)

    ConfigService.jwt = {
      secret: process.env.JWT_SECRET ?? 'jwtsecret'
    }

    ConfigService.app = {
      port: Number(process.env.PORT),
      name: process.env.APP_NAME ?? 'node-app'
    }

    ConfigService.db = {
      user: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      port: Number(process.env.DATABASE_PORT) ?? 5432,
      database: process.env.DATABASE_NAME ?? '',
      host: process.env.DATABASE_HOST ?? 'localhost'
    }
  }
}

export default ConfigService
