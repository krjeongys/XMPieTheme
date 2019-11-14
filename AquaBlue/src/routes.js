const router =  module.exports = require('next-routes')()

const isServer = () => Object.prototype.toString.call(global.process) === '[object process]'
let assetPrefix = ''
if (!isServer()) {
  const reg = /(.*)(\/[a-z]{2}-[A-Z]{2})/
  assetPrefix = reg.exec(location.pathname)[1]
}
const getRoute = (r) =>  assetPrefix + r

const routes = [
  '',
  '/',
  '/:languageCode/',
  '/:languageCode',
  '/:languageCode/:page/',
  '/:languageCode/:page',
  '/:languageCode/:page/:id'
]

routes.forEach(r => router.add( {name:getRoute(r) , page:'generic', pattern: getRoute(r)}))



