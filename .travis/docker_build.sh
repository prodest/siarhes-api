#!/bin/bash
set -ev

export DOCKER_IMAGE=prodest/api-siarhes:${TRAVIS_COMMIT:0:7}

# Faz o build da imagem Docker.
docker build --build-arg ORACLE_ZIP_DIR=$CACHE_DIR/oracle -t $DOCKER_IMAGE .
