const check = app_require('validators');
const MembrosDao = app_require('routes/v1/membros/membros.dao');

module.exports.install = (router) => {
    router.get('/membros', getMembros);
};

async function getMembros(ctx, next) {
    let queryParams = ctx.request.query;

    const dao = new MembrosDao(ctx.db);
    ctx.body = await dao.findAll(queryParams);
}
