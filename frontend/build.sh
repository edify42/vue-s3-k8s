#!/usr/bin/env bash

## YMMV - only works with my (edify42) machine as i own the dockerhub account
## tedk42

docker build . -t tedk42/vue-s3-dropzone:k8s-3

docker push tedk42/vue-s3-dropzone:k8s-3