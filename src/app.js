// https://gist.github.com/branneman/8048520
global.app_require = (path) => require(__dirname + '/' + path);

const debug = require('debug')('app:main');
const cfg = require('./config');

// New Relic
if (cfg.NODE_ENV === 'production') {
    // https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent#installing
    require('@newrelic/koa');
}

const Koa = require('koa');
const app = new Koa();
const compress = require('koa-compress');
const bouncer = require('koa-bouncer');
const oracledb = require('oracledb');

// DB configs.
oracledb.outFormat = oracledb.OBJECT;
oracledb.maxRows = 50;

// Middleware para validação.
app.use(bouncer.middleware());

// Middleware de compressão.
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

// Middleware para logar as requisições.
app.use(async (ctx, next) => {
    var start = new Date;
    await next();
    var ms = new Date - start;
    console.log('%s %s - %s', ctx.method, ctx.url, ms);
});

// Middleware para tratar erros.
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        debug(err);

        // Se for erro de validação, coloca o código 400.
        if (err instanceof bouncer.ValidationError) {
            err.status = 400;
        }

        // Se for erro do Oracle, pega somente a primeira linha do erro, sem o ORA-00000.
        if (err.message.indexOf('ORA-') == 0) {
            err.status = 400;
            err.message = /.*/.exec(err.message.slice(11))[0];
        }

        // Só retorno a mensagem no body, se não for erro interno.
        ctx.status = err.status || 500;
        if (ctx.status != 500) {
            ctx.body = {
                message: err.message
            };
        }
    }
});

// Módulo de acesso comum. Contem dados básicos do SIARHES.
require('./routes/v1/v1.routing').configure(app, cfg);

// Módulo de acesso exclusivo do Acesso Cidadão.
require('./routes/cidadao/cidadao.routing').configure(app, cfg);

module.exports = app;
