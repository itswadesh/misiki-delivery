import { resolve } from 'path'
import * as config from '@misiki/shared/nuxtConfig'
let { HTTP_ENDPOINT, dev } = require(resolve(process.cwd(), '../shared/config'))
const server = dev ? 'http://localhost:8886' : 'https://delivery.misiki.in'
config.ssr = false

config.apollo = {
  // watchLoading: '../shared/plugins/apollo-watch-loading-handler.js',
  // errorHandler: './plugins/apollo-error-handler.js',
  clientConfigs: {
    default: {
      httpEndpoint: server + '/graphql',
      wsEndpoint: HTTP_ENDPOINT.replace('http', 'ws') + '/graphql',
    },
  },
  defaultOptions: {
    $query: {
      loadingKey: 'loading',
      fetchPolicy: 'no-cache',
    },
  },
}
export default config
