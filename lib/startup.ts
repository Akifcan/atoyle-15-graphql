import ConfigService from './config/config.service'
import Db from './db/db.postgres'

const startup = async (useConsole = true): Promise<void> => {
  ConfigService.initialize()
  try {
    await Db.connect()
  } catch (e) {
    console.log(e)
  }
  if (useConsole) console.log('Connected to db!')
}

export default startup
