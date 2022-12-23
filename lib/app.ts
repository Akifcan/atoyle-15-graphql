import express, { Express } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { rootValue, schema } from '../modules'

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  '/graphql',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: {
      headerEditorEnabled: true
    }
  })
)

export default app
