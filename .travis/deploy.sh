#!/bin/bash
set -ev

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push $DOCKER_IMAGE

git clone https://github.com/prodest/api-cloud-v2.git

cd api-cloud-v2
npm install
node ./client.js --ENVIRONMENT=$RANCHER_ENV \
    --STACK=$RANCHER_STACK --SERVICE=$RANCHER_SERVICE \
    --IMAGE=$IMAGE_NAME --START_FIRST=$RANCHER_START_FIRST
