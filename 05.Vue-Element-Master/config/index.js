let path = require('path')

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production'
    },
    assetsRoot: path.resolve(__dirname, '../elm'),
    assetsPublicPath: '/elm/'
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    assetsPublicPath: '/'
  }
}