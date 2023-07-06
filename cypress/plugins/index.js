const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
module.exports = (on, config) => {
  on('task', {downloadFile})
}

const unzipping = require('./unzipping')

module.exports = (on, config) => {
    on('task', {
        'unzipping': unzipping.unzip,
    })
}