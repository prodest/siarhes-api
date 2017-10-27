/**
 * Testes para a API do Acesso Cidadão.
 */

var agent = require('supertest');
var assert = require('assert');
var sinon = require('sinon');
var cfg = require('../src/config');
var KoaOracle = require('koa-oracledb');
sinon.stub(KoaOracle.prototype, 'middleware').callsFake(function() {
    return function(ctx, next) { return next(); }
});

var servidorDAO = require('../src/routes/cidadao/servidor/servidor.dao');
sinon.stub(servidorDAO, 'buscaDadosPerfil').returns([]);
sinon.stub(servidorDAO, 'buscaDadosPessoais').returns([]);

// Deve ser declarada após as definições dos stubs,
// para que elas sejam usadas no lugar dos métodos reais.
var app = require('../src/app');

describe('API AC', function() {

    var server;

    // Usa o client como se fosse acesso cidadão para testar.
    app.context.token = {
        scope: ['siarhes_admin']
    };

    before(function(done) {
        let port = 3001;
        server = app.listen(port, () => {
            console.log('Testes iniciados na porta %s.', port);
            done();
        });
    });

    after(function() {
        server.close();
    });
    var testList = [];
    testList = [
        { endpoint: '/ac/servidor'      , query: undefined           , status: 400, message: 'O parâmetro cpf é obrigatório.' },
        { endpoint: '/ac/servidor'      , query: { cpf: 96985771734 }, status: 200, message: undefined },
        
        { endpoint: '/ac/servidor/dados', query: undefined           , status: 400, message: 'O parâmetro cpf é obrigatório.' },
        { endpoint: '/ac/servidor/dados', query: { cpf: 96985771734 }, status: 200, message: undefined },
    ];
    // Faz os testes de acesso aos endpoints e de parâmetros obrigatórios.
    testList.forEach(function(test) {
        let descr = 'endpoint ' + test.endpoint + ' retorna: ' + test.status;
        if (test.message) descr = descr + ' mensagem: "' + test.message + '"';
        it(descr, function(done) {
            var http = agent(server).get(test.endpoint);
            
            if (test.query)
                http.query(test.query);
            
            if (undefined != test.message)
                http.expect(function(res) {
                    assert.equal(res.body.message, test.message);
                });
            
            http.expect(test.status, done);
        });
    });

});
