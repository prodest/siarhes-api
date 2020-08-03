const Router = require('koa-router');
const KoaOracle = app_require('services/koa-oracledb');
const Auth = app_require('auth/auth');
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
    healthcheck.install(router, db);

    // Não faz a validação em testing
    if ((cfg.NODE_ENV !== 'testing') && (cfg.NODE_ENV !== 'development')) {
        router.use(auth.middleware({ scope: ['siarhes_admin'] }));
    }

    router.use(db.middleware());

    // Configuração das rotas, os prefixos são definidos aqui e
    // os endpoints nos controllers.
    require('./servidor/servidor.controller').install(router);

    // Instala as rotas deste módulo no app.
    app.use(router.middleware())
       .use(router.allowedMethods());

};
