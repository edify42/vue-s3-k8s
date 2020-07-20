var express = require('express')
const bodyParser = require('body-parser')
var AWS = require('aws-sdk')
var path = require('path')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8080

// Prometheus metrics
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
const Registry = client.Registry
const register = new Registry()
collectDefaultMetrics({ register })

// lambda counters
const countS3Success = new client.Counter({
  name: 'count_signed_url_success',
  help: 'all the successful pre-signed url requests returned from AWS'
})
const countS3Failed = new client.Counter({
  name: 'count_signed_url_failed',
  help: 'all the failed pre-signed url requests returned from AWS'
})

register.registerMetric(countS3Success)
register.registerMetric(countS3Failed)

var app = express()
app.use(bodyParser.json())
app.post('/lambda', function (req, res) {
  let prefix = process.env.BUCKET_PREFIX || 'uploads/test'
  let Bucket = process.env.BUCKET || 'lendi-hello-quick-demo-development' // 'lendi-assets-2020-development' // if we were using that...
  let payload = req.body
  var params = {
    Bucket,
    Key: `${prefix}/${payload.filePath}`,
    Expires: 600,
    ContentType: payload.contentType
  }
  let whoami = new AWS.STS()
  whoami.getCallerIdentity({}, (err, resp) => {
    if (err) {
      console.log('Error', err)
    } else {
      console.log(JSON.stringify(resp.Arn))
    }
  })
  let s3 = new AWS.S3({apiVersion: '2006-03-01'})

  console.log(params)

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      countS3Failed.inc()
      return new Error(err)
    } else {
      countS3Success.inc()
      res.send({url})
    }
  })
})

app.use('/', express.static(path.join(__dirname, '..', 'dist')))

app.get('/metrics', (req, resp) => {
  resp.send(register.metrics())
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
})
