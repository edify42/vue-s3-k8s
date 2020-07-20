#!/usr/bin/env bash

ltd provision --managed-template s3@latest --environment development \
--stack-name hello-quick-demo --stack-tag latest --team platform \
--parameter CORSEnabled=true --parameter Environment=development \
--parameter BucketName=hello-quick-demo
