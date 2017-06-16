[![Build Status](https://img.shields.io/travis/prodest/siarhes-api/develop.svg?label=develop-branch)](https://travis-ci.org/prodest/siarhes-api)
[![Build Status](https://img.shields.io/travis/prodest/siarhes-api/master.svg?label=master-branch)](https://travis-ci.org/prodest/siarhes-api)

## SIARHES API

Esta aplicação tem como objetivo servir o conteúdo do SIARHES, para que possa ser acessado de forma centralizada por diversos clientes.

A API foi dividida em módulos, cada um responsável por suas próprias rotas. Inicialmente temos o módulo **"ac"** que é responsável pelos *endpoints* acessados pelo **"Acesso Cidadão"**, e também o **"v1"** que traz diversas informações das tabelas do **SIARHES**.

## Configuração de Desenvolvimento

Para rodar a API localmente, algumas configurações devem ser feitas:
- Instalar o [Node.js](https://nodejs.org), versão 7.6 ou mais nova.
- Instalar o [Oracle Instant Client](http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html), e configurar de acordo com sua plataforma.
- Configurar o node-oracledb. [Windows](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instwin) ou [Linux](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instzip)

Comando para executar o serviço localmente:
```
npm start
```

Este comando irá iniciar um daemon, que irá reiniciar o serviço a cada mudança no código.

## Executar Testes

Para executar testes automatizados, foi usado o [Mocha](https://mochajs.org/). Os testes servem principalmente para verificar se todos os endpoints estão respondendo, e os parâmetros obrigatórios respeitados.

Comando para executar os testes:
```
npm test
```

## Executar ESLint

Para manter o estilo de código e também verificar alguns erros, foi usado o [ESLint](http://eslint.org/).

Instalar globalmente:
```
npm install -g eslint
```

Comando para executar a validação:
```
eslint src test
```

## Executar Usando Docker

A API está hospedada na mesma infraestrutura das demais APIs utilizadas no "ES na Palma da Mão", que é baseada em *containers*. O projeto já tem um Dockerfile pronto para build.

Para criar uma imagem Docker, basta executar o comando abaixo na raiz do projeto.
```
docker build . -t prodest/api_siarhes
```

Para rodar a imagem criada:
```
docker run -d --name api_siarhes -p 3000:3000 -e DB_USER=user -e DB_PASS=pass -e DB_URL=HOST/SERVICE -e NODE_ENV=production prodest/api_siarhes
```

## Gerar Documentação

A documentação dos endpoints da API foi feita usando o [Swagger Editor](http://editor.swagger.io/). Ela pode ser gerada automaticamente através do script (shell) gendoc.sh.

Executar os comandos abaixo irá gerar a documentação em _HTML_ na pasta **build/docs**.
```
npm install -g bootprint bootprint-openapi
bash gendoc.sh
```
