const PastasFuncionaisDao = app_require('routes/v1/pastas_funcionais/pastas_funcionais.dao');

module.exports.install = (router) => {
    router.get('/pastas_funcionais', getPastasFuncionais);
};

async function getPastasFuncionais(ctx, next) {
    ctx.validateQuery('numfunc')
        .required()
        .isNumeric();
    ctx.validateQuery('numvinc')
        .required()
        .isNumeric();
    ctx.validateQuery('orderBy')
        .defaultTo('pagina')
        .isIn(['pagina', 'assunto', 'data']);
    ctx.validateQuery('order')
        .defaultTo('asc')
        .isIn(['asc', 'desc']);
    
    const reqParams = ctx.request.query;

    if (reqParams.pagina) {
        if (!reqParams.numfunc || !reqParams.numvinc)
            ctx.throw(400, 'O parâmetro pagina só pode ser utilizado junto com o numfunc e numvinc.');
    }

    if (reqParams.assunto) {
        if (!reqParams.numfunc || !reqParams.numvinc)
            ctx.throw(400, 'O parâmetro assunto só pode ser utilizado junto com o numfunc e numvinc.');
    }
    
    let queryParams = reqParams;
    let orderBy = ctx.vals.orderBy;
    let order = ctx.vals.order;

    const dao = new PastasFuncionaisDao(ctx.db);
    ctx.body = await dao.findAll(queryParams, orderBy, order);
}
