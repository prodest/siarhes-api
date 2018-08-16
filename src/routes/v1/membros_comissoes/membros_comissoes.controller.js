const check = app_require('validators');
const MembrosComissoesDao = app_require('routes/v1/membros_comissoes/membros_comissoes.dao');

module.exports.install = (router) => {
    router.get('/membros_comissoes', getMembrosComissoes);
};

async function getMembrosComissoes(ctx, next) {
    let queryParams = ctx.request.query;

    const dao = new MembrosComissoesDao(ctx.db);
    ctx.body = await dao.findAll(queryParams);
}
