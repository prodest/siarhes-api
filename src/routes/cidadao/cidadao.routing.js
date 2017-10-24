const Router = require('koa-router');
const KoaOracle = require('koa-oracledb');
const Auth = app_require('auth/auth');
const heathcheck = app_require('healthcheck');

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
        poolAlias:     cfg.DB_POOL_AC,
        poolMax:       3
    });

    let router = new Router();
    if (cfg.REQUEST_PATH) {
        router.prefix('/' + cfg.REQUEST_PATH + '/ac');
    } else {
        router.prefix('/ac');
    }

    // Healthcheck
    heathcheck.install(router, db);

    // Não faz a validação em desenvolvimento para facilitar os testes.
    router.use(auth.middleware({ scope: ['siarhes_admin'] }));

    router.use(db.middleware());

    // Configuração das rotas, os prefixos são definidos aqui e
    // os endpoints nos controllers.
    require('./servidor/servidor.controller').install(router);

    // Instala as rotas deste módulo no app.
    app.use(router.middleware())
       .use(router.allowedMethods());

};
