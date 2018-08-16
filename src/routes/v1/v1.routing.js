const Router = require('koa-router');
const KoaOracle = require('koa-oracledb');
const Auth = app_require('auth/auth');
const sessao = app_require('auth/session');
const healthcheck = app_require('healthcheck');

module.exports.configure = (app, cfg) => {

    // Middleware de autenticação.
    const auth = new Auth({
        validationEndpoint: cfg.AUTH_ENDPOINT,
        jwtPublicKey:       cfg.AUTH_PUBLIC_KEY
    });

    // Usa um pool de conexão diferente.
    const db = new KoaOracle({
        user:          cfg.DB_USER,
        password:      cfg.DB_PASS,
        connectString: cfg.DB_URL,
        poolAlias:     cfg.DB_POOL_V1,
        poolMax:       3
    });

    let router = new Router();
    if (cfg.REQUEST_PATH) {
        router.prefix('/' + cfg.REQUEST_PATH + '/v1');
    } else {
        router.prefix('/v1');
    }

    // Healthcheck
    healthcheck.install(router, db);

    // Não faz a validação de token em testing.
    // Adiciona o scopo admin para facilitar consultas em outros ambientes.
    if (cfg.NODE_ENV !== 'testing') {
        router.use(auth.middleware({ scope: ['siarhes_admin', 'siarhes_basico'] }));
    } else {
        app.context.token = {
            scope: ['siarhes_admin']
        };
    }

    router.use(db.middleware());
    router.use(sessao.middleware());
    
    // Configuração das rotas, os prefixos são definidos aqui e
    // os endpoints nos controllers.
    require('./auditoria/auditoria.controller').install(router);
    require('./funcionarios/funcionarios.controller').install(router);
    require('./vinculos/vinculos.controller').install(router);
    require('./dependentes/dependentes.controller').install(router);
    require('./hist_depen/hist_depen.controller').install(router);
    require('./provimentos/provimentos.controller').install(router);
    require('./designacoes/designacoes.controller').install(router);
    require('./pastas_funcionais/pastas_funcionais.controller').install(router);
    require('./formacoes/formacoes.controller').install(router);
    require('./capacitacoes/capacitacoes.controller').install(router);
    require('./lic_afast/lic_afast.controller').install(router);
    require('./frequencias/frequencias.controller').install(router);
    require('./ferias/ferias.controller').install(router);
    require('./publicacoes/publicacoes.controller').install(router);
    require('./empresas/empresas.controller').install(router);
    require('./subempresas/subempresas.controller').install(router);
    require('./organograma/organograma.controller').install(router);    
    require('./comissoes/comissoes.controller').install(router);
    //require('./membros/membros.controller').install(router);
    
    // Instala as rotas deste módulo no app.
    app.use(router.middleware())
       .use(router.allowedMethods());

};
