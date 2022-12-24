import { Client } from 'pg'
import ConfigService from '../config/config.service'

async function connect(): Promise<void> {
  ConfigService.initialize()
  const client = new Client({
    user: ConfigService.db.user,
    password: ConfigService.db.password,
    database: ConfigService.db.database,
    port: ConfigService.db.port,
    host: ConfigService.db.host
  })
  await client.connect()

  try {
    const res = await client.query(`
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
    await client.end()
  } catch (e) {
    console.log(e)
  } finally {
    await client.end()
  }
}
connect()
  .then(() => {})
  .catch((e) => {
    console.log(e)
  })
