'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const app_1 = __importDefault(require('./lib/app'))
const config_service_1 = __importDefault(require('./lib/config/config.service'))
const startup_1 = __importDefault(require('./lib/startup'))
;(0, startup_1.default)()
  .then(() => {
    app_1.default.listen(config_service_1.default.app.port, () => {
      console.log(
        `⚡️[server]: - ${config_service_1.default.app.name} - Server is running at http://localhost:${config_service_1.default.app.port}`
      )
    })
  })
  .catch((e) => {
    console.log(e)
  })
