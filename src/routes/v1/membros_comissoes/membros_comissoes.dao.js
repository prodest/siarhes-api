const BaseDao = app_require('basedao');

module.exports = class MembrosComissoesDao extends BaseDao {
    async findAll(queryParams, orderBy, order) {
        var query  = 'SELECT * FROM u_apisiarhes.membros_comissoes_vw WHERE 1=1';
        return await this.executeSelect(query, queryParams);
    }
};
