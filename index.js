const makeXhr = require('basic-xhr')

const makeImport = require('./dynamic-import-factory.js')

module.exports = makeImport(makeXhr)
