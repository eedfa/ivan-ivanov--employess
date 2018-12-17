import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({
  ssrMode: typeof window !== 'undefined',
  cache: new InMemoryCache(),
  link: createUploadLink({ uri: 'http://localhost:4000/graphql' }) })
ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'))

serviceWorker.unregister()
