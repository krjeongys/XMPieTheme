const nextPort = 5010
const proxyPort = nextPort - 10
const fs = require('fs')
const express = require('express')
const next = require('next')
const helmet = require('helmet')
const httpProxy = require('express-http-proxy');
const proxy = require('http-proxy-middleware');
const routes = require('./routes')
const {join} = require('path')
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = routes.getRequestHandler(app)
const buildEnv = process.env.DEPLOY_ENV || 'dev'
const {assetPrefix, $assets} = require(`./next.${buildEnv}.config`)

const argv = (str) => {
  const idx = process.argv.findIndex((a) => a.startsWith(str))
  if (idx > -1) {
    return process.argv[idx].substring(str.length + 1)
  }
  return null
}
const uStoreServerUrl = argv('server') || 'http://uStoreNG.xmpie.net'

const proxyDirectories = ['/ustore', '/uStore', '/uStoreRestAPI', '/uStoreThemeCustomizations', '/uStoreThemes', '/favicon.ico']

const makeHttpProxy = (base) => httpProxy(`${uStoreServerUrl}`,
  {
    https: false,
    proxyReqPathResolver: (req) => base + req.url,
  }
)

if (argv('client')) {
  console.log('\x1b[31m%s\x1b[0m', '=====! Using exported directory !=====');
  const proxyServer = express();

  proxyServer.use(
    '/',
    proxy({
      target: `http://localhost:${nextPort}`,
      pathRewrite: {
        [`^${assetPrefix}`]: '/'
      }
    })
  );


  proxyServer.listen(proxyPort, proxyError => {
    if (proxyError) throw proxyError;

    const nextServer = express()

    nextServer.use(helmet.noCache())
    nextServer.use(helmet.frameguard())
    if (dev) {
      nextServer.use(express.static(__dirname + '/out'))
      nextServer.use('/webcomponents', express.static(join(__dirname, './webcomponents')))

      proxyDirectories.forEach(p => nextServer.use(p, makeHttpProxy(p)))
    }
    nextServer.get('*', (req, res) => {
      res.sendFile(__dirname + '/out/index.html')
    })
    nextServer.listen(nextPort, (err) => {
      if (err) throw err
      console.log(`next > Ready on http://localhost:${proxyPort}`)
    })
  });
} else {

  const proxyServer = express();

  proxyServer.use(
    '/',
    proxy({
      target: `http://localhost:${nextPort}`,
      pathRewrite: {
        [`^${assetPrefix}`]: '/'
      }
    })
  );

  proxyServer.listen(proxyPort, proxyError => {
    if (proxyError) throw proxyError;

    app.prepare()
      .then(() => {
        const nextServer = express()

        app.setAssetPrefix(`http://localhost:${proxyPort}${assetPrefix}`);
        nextServer.use(helmet.noCache())
        nextServer.use(helmet.frameguard())

        if (dev) {
          console.log('Dev server is serving static files')
          nextServer.use(`/assets`, express.static($assets))
          nextServer.use('/static', express.static(join(__dirname, '/static')))
          nextServer.use('/static-internal', express.static(join(__dirname, '/ustore-internal/static')))
          nextServer.use('webcomponents', express.static(join(__dirname, './webcomponents')))
          proxyDirectories.forEach(p => nextServer.use(p, makeHttpProxy(p)))
        }

        nextServer.get('*', (req, res) => {
          return handle(req, res)
        })

        nextServer.listen(nextPort, (err) => {
          if (err) throw err
          console.log(`next > Ready on http://localhost:${proxyPort}`)
        })
      })
      .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
      })
  });
}
