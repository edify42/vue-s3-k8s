require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
const bodyParser = require('body-parser');
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var AWS = require('aws-sdk')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
app.use(bodyParser.json())
app.post('/lambda', function (req, res) {
  let prefix = process.env.BUCKET_PREFIX || 'uploads/test'
  let Bucket = process.env.BUCKET || 'lendi-hello-quick-demo-development' // 'lendi-assets-2020-development'
  console.log('my body')
  console.log(req.body)
  let payload = req.body
  var params = {
    Bucket,
    Key: `${prefix}/${payload.filePath}`,
    Expires: 600,
    ContentType: payload.contentType
  }
  let whoami = new AWS.STS()
  whoami.getCallerIdentity({},(err, resp) => {
    if (err) {
      console.log("Error", err);
   } else {
      console.log(JSON.stringify(resp.Arn));
   }
  })
  let s3 = new AWS.S3({apiVersion: '2006-03-01'})

  console.log(params)

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      return new Error(err)
    } else {
      res.send({url})
      // res.send('hello, world!')
    }
  })
})
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    // opn(uri)
    console.log('was gonna open lol')
  }
})
