const express = require('express')
const http = require('http')
const cors = require('cors')
const { importSchema } = require('graphql-import')
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express')
const typeDefs = importSchema('./typeDefs/rootTypeDefs.graphql')
const FileResolver = require('./resolvers/fileResolver.js')
const app = express()
app.use(cors())

const resolvers = [FileResolver]
const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })

const graphqlServer = new ApolloServer({ schema,
  path: process.env.graphqlPath,
  context: ({ req, res }) => (
    req
  ) })

graphqlServer.applyMiddleware({ app })
const httpServer = http.createServer(app)
graphqlServer.installSubscriptionHandlers(httpServer)

httpServer.listen(4000, () => {
  console.log('UP!!!' + graphqlServer.graphqlPath)
  console.log(`🚀 Subscriptions ready at ws://localhost:4000${graphqlServer.subscriptionsPath}`)
})
