import * as AWS from 'aws-sdk'

export default {
  uploadFile (file) {
    let prefix = process.env('BUCKET_PREFIX') || 'uploads/test'
    let Bucket = process.env('BUCKET') || 'lendi-reconciler-development'
    // Create S3 service object
    let s3 = new AWS.S3({apiVersion: '2006-03-01'})
    let uploadParams = {
      Bucket,
      Key: `${prefix}/filename-dummy`,
      Body: file
    }

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log('Error', err)
      } if (data) {
        console.log('Upload Success', data.Location)
      }
    })
  },
  async urlGen (file) {
    let prefix = process.env.BUCKET_PREFIX || 'uploads/test'
    let Bucket = process.env.BUCKET || 'lendi-reconciler-development'
    console.log(Bucket)
    var params = {
      Bucket,
      Key: `${prefix}/${file.name}`,
      Expires: 600,
      ContentType: file.type
    }
    let s3 = new AWS.S3({apiVersion: '2006-03-01'})

    console.log(params)

    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        return new Error(err)
      } else {
        return url
      }
    })
  }
}
