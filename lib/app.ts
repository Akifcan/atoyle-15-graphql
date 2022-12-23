import express, { Express } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const root = {
  hello: () => {
    return 'Hello world!'
  }
}

app.use(
  '/graphql',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: {
      headerEditorEnabled: true
    }
  })
)

export default app
