
module.exports = class BaseDao {

    constructor(db) {
        this.db = db;
    }

    /**
     * Retorn todas as linhas da consulta, independente da configuração MAX_ROWS.
     * @param {*} query  SQL a ser executado.
     * @param {*} params Parâmetros da consulta.
     */
    async executeSelect(query, params) {
        var result = await this.db.execute(query, params, { resultSet: true, fetchArraySize: 300 });
        var rows = new Array();

        const rs = result.resultSet;
        let row;

        while ((row = await rs.getRow())) {
            rows.push(row);
        }

        await rs.close();
        return rows;
    }

    /**
     * Retorna todas as linhas do cursor.
     * @param {*} query  SQL a ser executado.
     * @param {*} params Parâmetros da consulta.
     * @param {*} field  Nome do campo que contem o cursor retornado.
     */
    async executeCursorFunction(query, params, field) {
        // TODO: Deixar mais genérica, no momento só funcionar com funções que retornam cursor.
        var result = await this.db.execute(query, params);
        var rows   = new Array();

        while (true) {
            let rowsTmp = await result.outBinds[field].getRows(10);
            if (rowsTmp.length == 0) break;
            rows = rows.concat(rowsTmp);
        }

        await result.outBinds.ret.close();
        return rows;
    }

};
