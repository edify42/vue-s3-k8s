let endpoint = 'https://k8s-reconciler-poc.lendi-paas-dev.net/lambda'

if (window.location.hostname === 'localhost') {
  endpoint = 'http://localhost:8080/lambda'
}

export default {
  AWS_LAMBDA_GETSIGNEDURL_ENDPOINT: endpoint
}
