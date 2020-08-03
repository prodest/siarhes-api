/**
 * Testes para a API Básica V1.
 * https://mochajs.org/#usage
 * https://github.com/visionmedia/supertest
 * https://nodejs.org/api/assert.html
 */

var agent = require('supertest');
var assert = require('assert');
var sinon = require('sinon');
var cfg = require('../src/config');
// Cria stubs para que não necessite acesso ao banco.
// O ideal era separar os testes unitários dos de integração.

var KoaOracle = require('../src/services/koa-oracle');
sinon.stub(KoaOracle.prototype, 'middleware').callsFake(function () {
    return function (ctx, next) { return next(); }
});

var sessao = require('../src/auth/session');
sinon.stub(sessao, 'middleware').callsFake(function () {
    return function (ctx, next) { return next(); }
});

var BaseDao = require('../src/basedao');
sinon.stub(BaseDao.prototype, 'executeSelect').returns([]);
sinon.stub(BaseDao.prototype, 'executeCursorFunction').returns([]);

// Deve ser declarada após as definições dos stubs,
// para que elas sejam usadas no lugar dos métodos reais.
var app = require('../src/app');

// Testes da api básica v1. São feitos apenas testes básicos,
// para verificar se os endpoints estão funcionandos e os parâmetros sendo validados.
describe('API V1', function () {

    var server;

    // Usa o client como se fosse bombeiros para testar.
    app.context.token = {
        client_empresa: 3,
        client_subempresa: 1,
        scope: ['siarhes_basico']
    };

    before(function (done) {
        let port = 3001;
        server = app.listen(port, () => {
            console.log('Testes iniciados na porta %s.', port);
            done();
        });
    });

    after(function () {
        server.close();
    });

    var now = new Date();
    var dataTeste = now.toISOString().slice(0, 10);
    var testList = [
        { endpoint: '/v1/vinculos', query: { numfunc: 273720 }, status: 200, message: undefined },
        { endpoint: '/v1/vinculos', query: { situacao: 'INVALIDA' }, status: 400, message: 'Situação inválida: INVALIDA' },
        { endpoint: '/v1/vinculos', query: { numfunc: 'letras' }, status: 400, message: 'numfunc must must only contain numbers' },
        { endpoint: '/v1/vinculos', query: { numvinc: 'letras' }, status: 400, message: 'numvinc must must only contain numbers' },
        // { endpoint: '/v1/vinculos'         , query: { empresa: 'letras' }          , status: 400, message: 'empresa must must only contain numbers' },
        // { endpoint: '/v1/vinculos'         , query: { subempresa: 'letras' }       , status: 400, message: 'subempresa must must only contain numbers' },

        { endpoint: '/v1/provimentos', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/provimentos', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/provimentos', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/pastas_funcionais', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/pastas_funcionais', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/pastas_funcionais', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/lic_afast', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/lic_afast', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/lic_afast', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/hist_depen', query: { numfunc: 317175, numdep: 1 }, status: 200, message: undefined },
        { endpoint: '/v1/hist_depen', query: { numfunc: 317175 }, status: 400, message: 'numdep is required' },
        { endpoint: '/v1/hist_depen', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/funcionarios', query: { numfunc: 273720 }, status: 200, message: undefined },
        { endpoint: '/v1/funcionarios', query: undefined, status: 400, message: 'Favor consultar com o numfunc, cpf ou nome.' },

        { endpoint: '/v1/frequencias', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/frequencias', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/frequencias', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/formacoes', query: { numfunc: 273720 }, status: 200, message: undefined },
        { endpoint: '/v1/formacoes', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/ferias', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/ferias', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/ferias', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/designacoes', query: { numfunc: 273720, numvinc: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/designacoes', query: { numfunc: 273720 }, status: 400, message: 'numvinc is required' },
        { endpoint: '/v1/designacoes', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/dependentes', query: { numfunc: 273720 }, status: 200, message: undefined },
        { endpoint: '/v1/dependentes', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/capacitacoes', query: { numfunc: 273720 }, status: 200, message: undefined },
        { endpoint: '/v1/capacitacoes', query: undefined, status: 400, message: 'numfunc is required' },

        { endpoint: '/v1/publicacoes', query: { pontpubl: 3909097 }, status: 200, message: undefined },
        { endpoint: '/v1/publicacoes', query: undefined, status: 400, message: 'pontpubl is required' },

        { endpoint: '/v1/empresas', query: undefined, status: 200, message: undefined },
        { endpoint: '/v1/empresas', query: { codigo: 1 }, status: 200, message: undefined },
        { endpoint: '/v1/empresas', query: { nome: 'COMUNICA' }, status: 200, message: undefined },
        { endpoint: '/v1/empresas', query: { fantasia: 'PRODEST' }, status: 200, message: undefined },

        { endpoint: '/v1/subempresas', query: undefined, status: 200, message: undefined },
        { endpoint: '/v1/subempresas', query: { empresa: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/subempresas', query: { codigo: 2 }, status: 400, message: 'Favor informar também a empresa.' },
        { endpoint: '/v1/subempresas', query: { empresa: 2, codigo: 1 }, status: 200, message: undefined },
        { endpoint: '/v1/subempresas', query: { nome: 'COMUNICA' }, status: 200, message: undefined },
        { endpoint: '/v1/subempresas', query: { fantasia: 'PRODEST' }, status: 200, message: undefined },

        { endpoint: '/v1/organograma', query: undefined, status: 200, message: undefined },
        { endpoint: '/v1/organograma', query: { empresa: 2 }, status: 200, message: undefined },
        { endpoint: '/v1/organograma', query: { empresa: 2, subempresa: 1 }, status: 200, message: undefined },
        { endpoint: '/v1/organograma/setores', query: undefined, status: 400, message: 'empresa is required' },
        { endpoint: '/v1/organograma/setores', query: { empresa: 2 }, status: 400, message: 'setor is required' },
        { endpoint: '/v1/organograma/setores', query: { empresa: 2, setor: 'CBMESPM' }, status: 200, message: undefined },
        { endpoint: '/v1/organograma/setor/servidores', query: undefined, status: 400, message: 'empresa is required' },
        { endpoint: '/v1/organograma/setor/servidores', query: { empresa: 2 }, status: 400, message: 'setor is required' },
        { endpoint: '/v1/organograma/setor/servidores', query: { empresa: 2, setor: 'CBMESPM' }, status: 200, message: undefined },
        { endpoint: '/v1/organograma/setor/gestor', query: undefined, status: 400, message: 'empresa is required' },
        { endpoint: '/v1/organograma/setor/gestor', query: { empresa: 1 }, status: 400, message: 'setor is required' },
        { endpoint: '/v1/organograma/setor/gestor', query: { empresa: 1, setor: 'CBMESPM' }, status: 200, message: undefined },

        { endpoint: '/v1/auditoria/vinculos', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/provimentos', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/pastas_funcionais', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/lic_afast', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/hist_depen', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/funcionarios', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/frequencias', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/formacoes', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/ferias', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/designacoes', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/dependentes', query: { data: dataTeste }, status: 200, message: undefined },
        { endpoint: '/v1/auditoria/capacitacoes', query: { data: dataTeste }, status: 200, message: undefined },
    ];

    // Faz os testes de acesso aos endpoints e de parâmetros obrigatórios.
    testList.forEach(function (test) {
        let descr = 'endpoint ' + test.endpoint + ' retorna: ' + test.status;
        if (test.message) descr = descr + ' mensagem: "' + test.message + '"';
        it(descr, function (done) {
            var http = agent(server).get(test.endpoint);

            if (test.query)
                http.query(test.query);

            if (undefined != test.message)
                http.expect(function (res) {
                    assert.equal(res.body.message, test.message);
                });

            http.expect(test.status, done);
        });
    });

});