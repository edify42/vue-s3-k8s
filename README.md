# vue-s3-dropzone

> Vue 2.0 dropzone component uploads files to AWS S3 serverlessly.

## Overview

- A Vue.js 2.0 component wrapping [Dropzone.js](https://github.com/enyo/dropzone)
- Secure backend will generate the S3 signed URL. Here we use a k8s pod which
can assume the role to create the signed URL.

This repo is based off work done here: https://github.com/kfei/vue-s3-dropzone

## Demo

![demo-gif](https://i.giphy.com/3oriNVluNp8DmKgvFS.gif)

## Quickstart

Clone this repo

```bash
git clone 
```

This repo contains two directories: **frontend** and **k8s-deploy**. You must first build the docker container and push it.

The k8s-deploy scripts use lendi-specific tools to deploy the cloudformation
stack but these can be replaced with a simple `aws cloudformation` style
command.

### Run locally

```bash
cd frontend
yarn
yarn run dev
```

You need the right set of AWS access keys exported to have bucket access.

## License

MIT
