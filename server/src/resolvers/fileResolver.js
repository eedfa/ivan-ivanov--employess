const { sendFileModel } = require('../models/fileModel.js')
const FileResolver = {
  Mutation: {
    async sendFile (root, args, context) {
      sendFileModel(args.file, context)
    }
  },
  Query: {
    async getResults (root, args, context) {
      return global.result
    }
  }
}

module.exports = FileResolver
