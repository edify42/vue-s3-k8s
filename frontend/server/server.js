var express = require('express')
const bodyParser = require('body-parser')
var AWS = require('aws-sdk')
var path = require('path')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8080

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
      console.log("Error", err)
    } else {
      console.log(JSON.stringify(resp.Arn))
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

app.use('/', express.static(path.join(__dirname, '..', 'dist')))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
})
