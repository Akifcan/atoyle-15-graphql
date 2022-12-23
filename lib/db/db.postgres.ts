import { Client } from 'pg'
import ConfigService from '../config/config.service'

class Db {
  static client: Client

  static async connect(): Promise<Client> {
    const client = new Client({
      user: ConfigService.db.user,
      password: ConfigService.db.password,
      database: ConfigService.db.database,
      port: ConfigService.db.port
    })
    await client.connect()
    Db.client = client
    return client
  }
}

export default Db
