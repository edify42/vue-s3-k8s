<template>
  <div id="app">
    <dropzone></dropzone>
    <div class="message">
      <h1>Welcome to the reconciler dropzone!</h1>
      <p>Drop a file above in the dropzone</p>
      <p>See it in our AWS Development environment in the S3 bucket lendi-hello-quick-demo-development</p>
      <p><a href="https://console.aws.amazon.com/s3/buckets/lendi-hello-quick-demo-development/uploads/test/?region=ap-southeast-2&tab=overview">Click here for the bucket</a></p>
    </div>
  </div>
</template>

<script>
import Dropzone from './components/Dropzone'

export default {
  name: 'app',
  components: {
    Dropzone
  }
}
</script>

<style lang="stylus">
body
  font-family 'Open Sans', sans-serif
.message {
  text-align: center;
}
</style>
