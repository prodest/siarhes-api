#!/bin/bash
set -ev

# Faz o build da imagem Docker.
docker build -t $DOCKER_IMAGE .
