#!/bin/bash
set -ev

# Descompacta para ser utilizado no "npm install", mas deixa o zip para ser usado no build do Docker.
unzip -q $CACHE_DIR/oracle/$INSTANT_CLIENT_ZIP
unzip -q $CACHE_DIR/oracle/$INSTANT_CLIENT_SDK_ZIP
mkdir -p $HOME/oracle/instantclient
mv -T instantclient_12_2 $HOME/oracle/instantclient

cd $HOME/oracle/instantclient
ln -s libclntsh.so.12.1 libclntsh.so
