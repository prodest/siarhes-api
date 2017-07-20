#!/bin/bash
set -ev

export DOCKER_IMAGE=prodest/api-siarhes:${TRAVIS_COMMIT:0:7}

# Faz o build da imagem Docker.
docker build -t $DOCKER_IMAGE .
