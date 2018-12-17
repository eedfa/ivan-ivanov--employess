
import gql from 'graphql-tag'

const sendFile = gql`mutation($file: Upload){  sendFile(   file: $file)}`
const getResult = gql` {
  getResults
}`
export { sendFile, getResult }
