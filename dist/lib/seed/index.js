'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const pg_1 = require('pg')
const config_service_1 = __importDefault(require('../config/config.service'))
function connect() {
  return __awaiter(this, void 0, void 0, function* () {
    config_service_1.default.initialize()
    const client = new pg_1.Client({
      user: config_service_1.default.db.user,
      password: config_service_1.default.db.password,
      database: config_service_1.default.db.database,
      port: config_service_1.default.db.port,
      host: config_service_1.default.db.host
    })
    yield client.connect()
    try {
      const res = yield client.query(`
      CREATE TABLE IF NOT EXISTS employee (
        id INTEGER NOT NULL generated always as identity,
        name VARCHAR(40) NOT NULL,
        password VARCHAR(80) NOT NULL,
        department VARCHAR(80) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isActive boolean DEFAULT true,

        PRIMARY KEY (id)
      );

      CREATE TABLE IF NOT EXISTS post (
        id INTEGER NOT NULL generated always as identity,
        employeeId INTEGER NOT NULL,
        content VARCHAR(280) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        FOREIGN KEY (employeeId) REFERENCES employee(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS comment (
        id INTEGER NOT NULL generated always as identity,
        employeeId INTEGER NOT NULL,
        postId INTEGER,
        commentId INTEGER,
        content VARCHAR(280) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        FOREIGN KEY (employeeId) REFERENCES employee(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE,
        FOREIGN KEY (commentId) REFERENCES comment(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reaction (
        id INTEGER NOT NULL generated always as identity,
        employeeId INTEGER NOT NULL,
        postId INTEGER,
        commentId INTEGER,

        type VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        FOREIGN KEY (employeeId) REFERENCES employee(id) ON DELETE CASCADE,
        FOREIGN KEY (commentId) REFERENCES comment(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE);

      ALTER TABLE employee ADD slug VARCHAR(80);
      ALTER TABLE employee ADD description VARCHAR(280);
      
      `)
      console.log(res)
      yield client.end()
    } catch (e) {
      console.log(e)
    } finally {
      yield client.end()
    }
  })
}
connect()
  .then(() => {})
  .catch((e) => {
    console.log(e)
  })
