const check = app_require('validators');
const ComissoesDao = app_require('routes/v1/comissoes/comissoes.dao');

module.exports.install = (router) => {
    router.get('/comissoes', getComissoes);
};

async function getComissoes(ctx, next) {
    let queryParams = ctx.request.query;

    const dao = new ComissoesDao(ctx.db);
    ctx.body = await dao.findAll(queryParams);
}
