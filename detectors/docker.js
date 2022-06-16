const fs = require('fs')

module.exports = () => {
  return fs.existsSync('/.dockerenv')
}
