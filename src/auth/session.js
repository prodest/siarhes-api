const check = require('../validators');

// Middleware para configurar o formato/timezone de data da sessão do banco.
// https://github.com/oracle/node-oracledb/blob/master/doc/api.md#typemap
// module.exports.nlsConfig = () => async (ctx, next) => {
//     await ctx.db.execute("ALTER SESSION SET TIME_ZONE='America/Sao_Paulo'");
//     await next();
// }

// Middleware para configuração da sessão no banco, onde irá limitar o
// acesso somente aos dados da empresa/subempresa do client.
// Para usuários privilegiados, pode ser acessado usando tanto numfunc/numvinc quando empresa/subempresa.
// Retorna a função (middleware).
module.exports.middleware = () => async (ctx, next) => {
    let token = ctx.token;
    let query = ctx.request.query;

    // Deixei a mensagem em inglês para ficar de acordo com o koa-bouncer.
    if (!check.opcionalNumerico(query.cpf))
        ctx.throw(400, 'cpf must must only contain numbers');
    if (!check.opcionalNumerico(query.numfunc))
        ctx.throw(400, 'numfunc must must only contain numbers');
    if (!check.opcionalNumerico(query.numvinc))
        ctx.throw(400, 'numvinc must must only contain numbers');
    if (!check.opcionalNumerico(query.empresa))
        ctx.throw(400, 'empresa must must only contain numbers');
    if (!check.opcionalNumerico(query.subempresa))
        ctx.throw(400, 'subempresa must must only contain numbers');

    if (token.scope.includes('siarhes_admin')) {
        if (query.cpf)
            await setServidorCPF(ctx.db, query.cpf);
        else if (query.numfunc || query.numvinc)
            await setServidor(ctx.db, query.numfunc, query.numvinc);
        else if (query.empresa || query.subempresa)
            await setSubempresa(ctx.db, query.empresa, query.subempresa);
        else
            // TODO: Melhorar a forma que a sessão é usada na API.
            // No momento tive que colocar essa condição, pois são os únicos endpoints que podem ser consultados
            // sem passar um dos parâmetros validados aqui.
            if 
            (
                    !ctx.path.endsWith('/empresas') 
                &&  !ctx.path.endsWith('/subempresas') 
                &&  !ctx.path.endsWith('/organograma')
                &&  !ctx.path.endsWith('/comissoes/')
            ){
                ctx.throw(401, 'Favor consultar com o cpf, numfunc, numvinc, empresa ou subempresa.');
            }
    } else {
        if (!token.client_empresa || !token.client_subempresa)
            ctx.throw(401, 'Empresa/Subempresa não conrigurada no client.');
        
        await setSubempresa(ctx.db, token.client_empresa, token.client_subempresa);
    }
    
    await next();
};

/**
 * Seta o numfunc na package de controle de acesso passando o cpf como parâmetro.
 * @return promise de execução no banco.
 */
function setServidorCPF(db, cpf) {
    return db.execute(`
            BEGIN
                u_apisiarhes.pck_web_api.set_usuario(:usuario);
                u_apisiarhes.pck_web_api.set_servidor(:cpf);
            END;
        `,
        { usuario: 'zeus', cpf: cpf }
    );
}

/**
 * Seta o numfunc/numvinc na package de controle de acesso.
 * @return promise de execução no banco.
 */
function setServidor(db, numfunc, numvinc) {
    return db.execute(`
            BEGIN
                u_apisiarhes.pck_web_api.set_usuario(:usuario);
                u_apisiarhes.pck_web_api.set_servidor(:numfunc, :numvinc);
            END;
        `,
        { usuario: 'zeus', numfunc: numfunc, numvinc: numvinc }
    );
}

/**
 * Seta a empresa/subempresa na package de controle de acesso.
 * @return promise de execução no banco.
 */
function setSubempresa(db, empresa, subempresa) {
    return db.execute(`
            BEGIN
                u_apisiarhes.pck_web_api.set_usuario(:usuario);
                u_apisiarhes.pck_web_api.set_orgao(:empresa, :subempresa);
            END;
        `,
        { usuario: 'zeus', empresa: empresa, subempresa: subempresa }
    );
}
