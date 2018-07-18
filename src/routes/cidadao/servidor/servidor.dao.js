const oracledb = require('oracledb');

module.exports.buscaDadosPerfil = async (conn, cpf) => {
    const query  = 'BEGIN :ret := U_APISIARHES.PCK_WEB_ACESSO_CID.BUSCA_DADOS_PERFIL(:cpf); END;';
    const params = { cpf: cpf, ret: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };

    var result = await conn.execute(query, params);
    var rows   = new Array();

    while (true) {
        let rowsTmp = await result.outBinds.ret.getRows(10);
        if (rowsTmp.length == 0) break;
        rows = rows.concat(rowsTmp);
    }

    await result.outBinds.ret.close();
    return rows;
};

module.exports.buscaDadosPessoais = async (conn, cpf) => {
    const query  = 'BEGIN :ret := U_APISIARHES.PCK_WEB_ACESSO_CID.BUSCA_DADOS_PESSOAIS(:cpf); END;';
    const params = { cpf: cpf, ret: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    
    let result = await conn.execute(query, params);
    var rows   = new Array();

    while (true) {
        let rowsTmp = await result.outBinds.ret.getRows(10);
        if (rowsTmp.length == 0) break;
        rows = rows.concat(rowsTmp);
    }

    await result.outBinds.ret.close();
    return rows;
};


module.exports.buscaDadosPerfilExerc = async (conn, cpf) => {
    const query  = 'BEGIN :ret := U_APISIARHES.PCK_WEB_ACESSO_CID.busca_dados_perfil_exerc(:cpf); END;';
    const params = { cpf: cpf, ret: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };

    var result = await conn.execute(query, params);
    var rows   = new Array();

    while (true) {
        let rowsTmp = await result.outBinds.ret.getRows(10);
        if (rowsTmp.length == 0) break;
        rows = rows.concat(rowsTmp);
    }

    await result.outBinds.ret.close();
    return rows;
};

module.exports.buscaDadosTotal = async (conn, pagina, tam_pagina) => {
    const query  = 'BEGIN :ret := U_APISIARHES.PCK_WEB_ACESSO_CID.busca_dados_perfil_total(:pagina, :tam_pagina); END;';
    const params = {pagina: pagina, tam_pagina: tam_pagina, ret: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };    
    
    let result = await conn.execute(query, params);
    let rows   = new Array();

    while (true) {
        let rowsTmp = await result.outBinds.ret.getRows(1000);
        if (rowsTmp.length == 0) break;
        rows = rows.concat(rowsTmp);
    }

    await result.outBinds.ret.close();
    return rows;
};