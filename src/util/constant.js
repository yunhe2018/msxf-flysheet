let apiPrefix = ''
let imgPrefix = ''
if (process.env.NODE_ENV === 'development') {
  apiPrefix = 'http://10.193.198.8:8055/flysheet-admin'
  imgPrefix = 'http://10.193.198.8:8055'
  // apiPrefix = 'http://192.168.1.120:8055/flysheet-admin'
  // imgPrefix = 'http://192.168.1.120:8055'
} else if (process.env.NODE_ENV === 'production') {
  apiPrefix = '/flysheet-admin'
}

module.exports = {
  apiPrefix,
  imgPrefix
}
