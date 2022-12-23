import ConfigService from './config/config.service'
import Db from './db/db.postgres'

const startup = async (): Promise<void> => {
  ConfigService.initialize()
  try {
    await Db.connect()
  } catch (e) {
    console.log(e)
  }
}

export default startup
