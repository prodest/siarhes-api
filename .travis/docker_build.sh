#!/bin/bash
set -ev

export DOCKER_IMAGE=prodest/api-siarhes:${TRAVIS_COMMIT:0:7}

# Copia os arquivos de instalação para a pasta local.
cp -r $CACHE_DIR/oracle/ ./oracle

# Faz o build da imagem Docker.
docker build -t $DOCKER_IMAGE .
