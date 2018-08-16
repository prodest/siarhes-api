const BaseDao = app_require('basedao');

module.exports = class ComissoesDao extends BaseDao {
    async findAll(queryParams, orderBy, order) {
        var query  = 'SELECT * FROM u_apisiarhes.comissoes_vw WHERE 1=1';
        return await this.executeSelect(query, queryParams);
    }
};
