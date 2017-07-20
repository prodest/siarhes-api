#!/bin/bash
set -ev

GO_FILE=go1.8.3.linux-amd64.tar.gz

# Se já estiver no cache, não é necessário fazer o download novamente.
if [ -f $CACHE_DIR/oracle/$INSTANT_CLIENT_ZIP ] && [ -f $CACHE_DIR/oracle/$INSTANT_CLIENT_SDK_ZIP ]; then
    echo "Usando arquivos em encontrados no cache."
    exit 0
fi

# Instala o Go para ser usado com a ferramenta que faz o download na OTN.
# https://golang.org/doc/install
curl -O "https://storage.googleapis.com/golang/${GO_FILE}"
sudo tar -C /usr/local -xzf $GO_FILE
rm $GO_FILE
export GOPATH=$HOME/go
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$GOPATH/bin

# Baixa a ferramenta de download e também o client que será usado no build.
go get github.com/tschf/odl
odl --component instantclient-basic --version 12.2.0.1.0 --os linux --arch x64 --accept-license
odl --component instantclient-sdk --version 12.2.0.1.0 --os linux --arch x64 --accept-license
ls -la

# Copi os arquivos baixados para a pasta de cache.
mkdir -p $CACHE_DIR/oracle
mv *.zip $CACHE_DIR/oracle/
