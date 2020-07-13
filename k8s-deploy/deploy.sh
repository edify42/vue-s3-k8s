#!/usr/bin/env bash

environment="${1:-development}"

if [ "$environment" != 'development' ]; then
  echo "--- Not ready for $environment"
  exit 1
fi

# Functions block
get_kubectl() {
  if [ "$CI" = 'true' ] && [ "$OSTYPE" = 'linux-gnu' ]; then
    local version=v1.16.7
    curl -sLO "https://storage.googleapis.com/kubernetes-release/release/$version/bin/linux/amd64/kubectl"
    chmod +x kubectl
    curl -o aws-iam-authenticator -s https://amazon-eks.s3-us-west-2.amazonaws.com/1.15.10/2020-02-22/bin/linux/amd64/aws-iam-authenticator
    chmod +x aws-iam-authenticator
    mv kubectl /usr/local/bin
    mv aws-iam-authenticator /usr/local/bin
  fi
}

product="poc-reconciler"

helm_install() {
  extra_args="$1"
  echo "Installing..."
  helm install "$RELEASE_NAME" "$CHART" \
  --namespace "${NAMESPACE}" \
  --values "${product}/values.yml" \
  ${extra_args}
}

helm_upgrade() {
  echo "Upgrading..."
  helm upgrade "$RELEASE_NAME" "$CHART" \
  --namespace "${NAMESPACE}" \
  --values "${product}/values.yml" \
  ${extra_args}
}

get_kubectl

helm repo add lendi http://platform-helm-repo-management.s3-website-ap-southeast-2.amazonaws.com
helm repo update

# Shared variables
NAME="platform-$product"
RELEASE_NAME="$NAME-$environment"
NAMESPACE="$NAME-$environment"
SERVICE_ACCOUNT="system:serviceaccount:${NAMESPACE}:${RELEASE_NAME}"

# lcd upgrade is a WIP. For now, we'll create the role via ltd
ltd provision --environment "${environment}" --stack-name "k8s-${NAME}" \
--template-file ./cloudformation.yml  --stack-tag latest \
--team platform --capability CAPABILITY_IAM \
--parameter ServiceAccount="$SERVICE_ACCOUNT"

# only 1 output in the above template...
POD_ROLE=$(liam exec --environment "${environment}" --role deployer \
-- aws cloudformation describe-stacks --stack-name "k8s-${NAME}" \
--query "Stacks[0].Outputs[0].OutputValue" --output text)

echo "Pod role is: ${POD_ROLE}"

CHART=lendi/kapp
kubectl apply -f namespace.yml
extra_args="--set-string serviceAccount.arn=${POD_ROLE}"


helm status $RELEASE_NAME --namespace "$NAMESPACE"
if [ "$?" -eq "0" ]
then
  helm_upgrade "$extra_args"
else
  helm_install "$extra_args"
fi
