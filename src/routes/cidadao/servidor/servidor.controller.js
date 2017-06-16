const servidorDAO = app_require('routes/cidadao/servidor/servidor.dao');
const _ = require('underscore');

module.exports.install = (router) => {
    router.get('/servidor'      , getSituacaoServidor);
    router.get('/servidor/dados', getDadosPessoais);
};

async function getSituacaoServidor(ctx, next) {
    ctx.validateQuery('cpf').required('O parâmetro cpf é obrigatório.');

    var reqParams = ctx.request.query;
    var rows = await servidorDAO.buscaDadosPerfil(ctx.db, reqParams.cpf);

    // Agrupa o array por tipo, sitacao e numfunc.
    var group = _.groupBy(rows, (row) => [row.TIPO, row.NUMFUNC]);
    var perfis = new Array();

    for (let [ignored, grupoValue] of Object.entries(group)) {
        var ocupacoes = new Array();

        // Insere cada ocupação, omitindo os valores agrupados.
        for (let [ignored, ocupValue] of Object.entries(grupoValue)) {
            ocupacoes.push(_.omit(ocupValue, ['TIPO', 'NUMFUNC']));
        }

        // Salva as ocupações no perfil.
        perfis.push({
                "TIPO":      grupoValue[0].TIPO,
                "NUMFUNC":   grupoValue[0].NUMFUNC,
                "OCUPACOES": ocupacoes
        });
    }

    ctx.body = {
        "CPF":    reqParams.cpf,
        "PERFIS": perfis
    };
}

async function getDadosPessoais(ctx, next) {
    ctx.validateQuery('cpf').required('O parâmetro cpf é obrigatório.');
    
    var reqParams = ctx.request.query;
    var row = await servidorDAO.buscaDadosPessoais(ctx.db, reqParams.cpf);
    if (!row)
        ctx.throw(400, 'CPF não encontrado no SIARHES.');
    else
        ctx.body = row;
}
