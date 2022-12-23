import app from './lib/app'
import ConfigService from './lib/config/config.service'
import startup from './lib/startup'

startup()
  .then(() => {
    app.listen(ConfigService.app.port, () => {
      console.log(
        `⚡️[server]: - ${ConfigService.app.name} - Server is running at http://localhost:${ConfigService.app.port}`
      )
    })
  })
  .catch((e) => {
    console.log(e)
  })
